use platform::mac;
use std::sync::Mutex;
use tauri::{ActivationPolicy, App, Manager};
use tauri_plugin_autostart::MacosLauncher;

use crate::shortcut::{setup_shortcut, Shortcuts};

mod capture;
mod config;
mod platform;
mod shortcut;
mod tray;
mod window;

pub struct QuitState {
    pub quitting: bool,
}

fn setup(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    app.manage(Mutex::new(QuitState { quitting: false }));
    app.manage(Mutex::new(Shortcuts::default()));
    config::setup_config(app)?;
    setup_shortcut(app.handle());
    tray::setup_tray(app)?;
    mac::setup_notification(app);
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut app = tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            capture::capture,
            shortcut::register_capture_shortcut,
            shortcut::unregister_capture_shortcut,
            shortcut::get_registered_shortcut
        ])
        .setup(|app| setup(app))
        .build(tauri::generate_context!())
        .expect("error while running tauri application");
    #[cfg(target_os = "macos")]
    {
        app.set_activation_policy(ActivationPolicy::Accessory);
        app.set_dock_visibility(false);
    }
    app.run(|app_handle, event| {
        if let tauri::RunEvent::ExitRequested { api, .. } = event {
            let app_state_mutex = app_handle.state::<Mutex<QuitState>>();
            let app_state = app_state_mutex.lock().unwrap();
            if !app_state.quitting {
                api.prevent_exit();
            }
        }
    });
}
