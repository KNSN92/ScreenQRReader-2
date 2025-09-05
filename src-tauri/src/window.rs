use crate::platform;
use tauri::{
    utils::{config::WindowEffectsConfig, WindowEffect},
    AppHandle, LogicalPosition, LogicalSize, Manager, WebviewUrl, WebviewWindow,
    WebviewWindowBuilder,
};
use xcap::Monitor;

pub fn start_capture(app: &AppHandle) {
    let monitors = Monitor::all().expect("failed to get monitors");
    for monitor in monitors {
        let create_window_result = create_capture_window(app, monitor);
        if let Err(err) = create_window_result {
            match err {
                tauri::Error::WebviewLabelAlreadyExists(_) => {}
                _ => {
                    panic!("failed to create window: {err:?}")
                }
            }
        }
    }
}

fn create_capture_window(app: &AppHandle, monitor: Monitor) -> tauri::Result<WebviewWindow> {
    let monitor_position = LogicalPosition::new(monitor.x().unwrap(), monitor.y().unwrap());
    let monitor_size = LogicalSize::new(monitor.width().unwrap(), monitor.height().unwrap());
    let monitor_id = monitor.id().unwrap();
    let window = WebviewWindowBuilder::new(
        app,
        format!("cropping:{monitor_id}"),
        WebviewUrl::App("index.html".into()),
    )
    .inner_size(
        (monitor_size.width + 2) as f64,
        (monitor_size.height + 2) as f64,
    )
    .resizable(false)
    .transparent(true)
    .decorations(false)
    .always_on_top(true)
    .visible_on_all_workspaces(true)
    .build()?;
    platform::mac::set_front(&window)?;
    window.set_position(LogicalPosition::new(
        monitor_position.x - 1,
        monitor_position.y - 1,
    ))?;
    Ok(window)
}

pub fn setup_shortcut_key_config_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("shortcut_config") {
        window.set_focus().unwrap();
    } else {
        WebviewWindowBuilder::new(app, "shortcut_config", WebviewUrl::App("index.html".into()))
            .inner_size(300., 200.)
            .focused(true)
            .resizable(false)
            .transparent(true)
            .decorations(false)
            .always_on_top(true)
            .effects(WindowEffectsConfig {
                effects: vec![WindowEffect::FullScreenUI],
                radius: Some(10.),
                ..Default::default()
            })
            .build()
            .unwrap();
    }
}
