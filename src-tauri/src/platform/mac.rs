use std::{cell::RefCell, collections::HashMap, ptr::NonNull};

use block2::RcBlock;
use objc2::{
    define_class, msg_send,
    rc::Retained,
    runtime::{AnyObject, Bool, ProtocolObject},
    AnyThread, DefinedClass,
};
use objc2_app_kit::{NSStatusWindowLevel, NSWindow, NSWindowCollectionBehavior};
use objc2_core_graphics::{CGPreflightScreenCaptureAccess, CGRequestScreenCaptureAccess};
use objc2_foundation::{
    ns_string, NSArray, NSDictionary, NSError, NSObject, NSObjectProtocol, NSSet, NSString,
};
use objc2_user_notifications::{
    UNAuthorizationOptions, UNAuthorizationStatus, UNMutableNotificationContent,
    UNNotificationCategory, UNNotificationCategoryOptions, UNNotificationDefaultActionIdentifier,
    UNNotificationDismissActionIdentifier, UNNotificationRequest, UNNotificationResponse,
    UNNotificationSettings, UNUserNotificationCenter, UNUserNotificationCenterDelegate,
};
use tauri::{AppHandle, WebviewWindow};

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

pub fn is_screenshot_allowed() -> bool {
    CGPreflightScreenCaptureAccess()
}

pub fn request_allow_screenshot() {
    CGRequestScreenCaptureAccess();
}

struct NotificationDelegateVars {
    callbacks: RefCell<HashMap<String, Box<dyn FnOnce() + Send + 'static>>>,
}

define_class!(
    #[unsafe(super(NSObject))]
    #[ivars = NotificationDelegateVars]
    struct NotificationDelegate;

    unsafe impl NSObjectProtocol for NotificationDelegate {}

    unsafe impl UNUserNotificationCenterDelegate for NotificationDelegate {
        #[allow(non_snake_case)]
        #[unsafe(method(userNotificationCenter:didReceiveNotificationResponse:withCompletionHandler:))]
        unsafe fn userNotificationCenter_didReceiveNotificationResponse_withCompletionHandler(
            &self,
            _center: &UNUserNotificationCenter,
            response: &UNNotificationResponse,
            completion_handler: &block2::DynBlock<dyn Fn()>,
        ) {
            let action_identifier = &*response.actionIdentifier();
            let clicked = action_identifier == UNNotificationDefaultActionIdentifier;
            let dismissed = action_identifier == UNNotificationDismissActionIdentifier;
            println!("notification clicked? {clicked}");
            println!("notification dismissed? {dismissed}");
            if clicked || dismissed {
                let user_info = response.notification().request().content().userInfo();
                let id = user_info.objectForKey(ns_string!("callback_id"));
                if let Some(id) = id {
                    let id = id.downcast::<NSString>().unwrap().to_string();
                    let mut callbacks = self.ivars().callbacks.borrow_mut();
                    if clicked {
                        let callback = callbacks.remove(&id);
                        if let Some(callback) = callback {
                            callback();
                        }
                    } else if dismissed {
                        callbacks.remove(&id);
                    }
                }
            }
            completion_handler.call(());
        }
    }
);

impl NotificationDelegate {
    fn new() -> Retained<Self> {
        let this = Self::alloc().set_ivars(NotificationDelegateVars {
            callbacks: RefCell::new(HashMap::new()),
        });
        unsafe { msg_send![super(this), init] }
    }
}

pub fn setup_notification() {
    if cfg!(debug_assertions) {
        return;
    } else {
        // let identifier = &app.config().identifier;
        unsafe {
            let user_notification_center = UNUserNotificationCenter::currentNotificationCenter();
            user_notification_center.setNotificationCategories(&*NSSet::from_slice(&[
                &*UNNotificationCategory::categoryWithIdentifier_actions_intentIdentifiers_options(
                    ns_string!("dismiss"),
                    &NSArray::new(),
                    &NSArray::new(),
                    UNNotificationCategoryOptions::CustomDismissAction,
                ),
            ]));
            user_notification_center.requestAuthorizationWithOptions_completionHandler(
                UNAuthorizationOptions::Alert | UNAuthorizationOptions::Sound,
                &*RcBlock::new(|authorized: Bool, err: *mut NSError| {
                    if !authorized.as_bool() {
                        println!("Not authorized")
                    }
                    println!("error is null? {}", err.is_null());
                    if !err.is_null() {
                        let err = &*err;
                        println!(
                            "{:?}\n{:?}",
                            err.localizedDescription(),
                            err.localizedFailureReason()
                        )
                    }
                }),
            );
            let delegate = NotificationDelegate::new();
            user_notification_center
                .setDelegate(Some(&*ProtocolObject::from_retained(delegate.clone())));
            println!(
                "delegate is none ? {}",
                user_notification_center.delegate().is_none()
            );
            Retained::into_raw(delegate);
        }
    }
}

#[allow(unused)]
pub fn notify(
    app: &AppHandle,
    title: &'static str,
    message: &'static str,
    callback: Option<impl FnOnce() + Send + 'static>,
) {
    if cfg!(debug_assertions) {
        return;
    } else {
        app.run_on_main_thread(move || unsafe {
            let user_notification_center = UNUserNotificationCenter::currentNotificationCenter();
            let id: Option<String> = if let Some(callback) = callback {
                let delegate = user_notification_center
                    .delegate()
                    .expect("delegate is none")
                    .downcast::<NotificationDelegate>()
                    .expect("delegate is not a notification delegate");
                let id = uuid::Uuid::new_v4().to_string();
                delegate
                    .ivars()
                    .callbacks
                    .borrow_mut()
                    .insert(id.clone(), Box::new(callback));
                Some(id)
            } else {
                None
            };
            user_notification_center.getNotificationSettingsWithCompletionHandler(&RcBlock::new(
                move |settings: NonNull<UNNotificationSettings>| {
                    let user_notification_center =
                        UNUserNotificationCenter::currentNotificationCenter();
                    let settings = settings.as_ref();
                    if settings.authorizationStatus() != UNAuthorizationStatus::Authorized {
                        return;
                    }
                    let content = UNMutableNotificationContent::new();
                    content.setCategoryIdentifier(ns_string!("dismiss"));

                    content.setTitle(&NSString::from_str(title));
                    content.setBody(&NSString::from_str(message));

                    if let Some(id) = &id {
                        let user_info = NSDictionary::from_slices(
                            &[ns_string!("callback_id")],
                            &[&*NSString::from_str(id)],
                        );
                        let user_info = Retained::cast_unchecked::<
                            NSDictionary<AnyObject, AnyObject>,
                        >(user_info);
                        content.setUserInfo(&*user_info);
                    }

                    let request = UNNotificationRequest::requestWithIdentifier_content_trigger(
                        &NSString::from_str("screenqrreader_notification"),
                        &content,
                        None,
                    );
                    user_notification_center
                        .addNotificationRequest_withCompletionHandler(&request, None);
                },
            ));
        })
        .expect("Failed to notificate");
    }
}
