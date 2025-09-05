use std::time::Duration;

use mac_notification_sys::{set_application, Notification, NotificationResponse};
use objc2_app_kit::{NSStatusWindowLevel, NSWindow, NSWindowCollectionBehavior};
use tauri::{App, WebviewWindow};

pub fn set_front(window: &WebviewWindow) -> tauri::Result<()> {
    let nswindow = unsafe { &*(window.ns_window()? as *const NSWindow) };
    nswindow.setLevel(NSStatusWindowLevel + 1);
    nswindow.orderFront(None);
    unsafe {
        nswindow.setCollectionBehavior(
            NSWindowCollectionBehavior::CanJoinAllSpaces
                | NSWindowCollectionBehavior::Stationary
                | NSWindowCollectionBehavior::FullScreenAuxiliary,
        )
    }
    Ok(())
}

pub fn setup_notification(app: &App) {
    let identifier = &app.config().identifier;
    set_application(identifier).expect("notification setup error");
}

pub fn notify(
    title: &'static str,
    message: &'static str,
    click_action: Option<impl FnOnce() + Send + 'static>,
) {
    let mut notification = Notification::new();
    notification
        .title(title)
        .message(message)
        .asynchronous(false)
        .wait_for_click(true);
    let join_handle = tauri::async_runtime::spawn_blocking(move || {
        let response = notification.send().expect("notification error");
        if matches!(response, NotificationResponse::Click) && click_action.is_some() {
            let action = click_action.unwrap();
            action();
        }
    });
    tauri::async_runtime::spawn(async {
        let abort_handle = join_handle.inner().abort_handle();
        let _ = tokio::time::timeout(Duration::from_secs(120), join_handle).await;
        abort_handle.abort();
    });
}
