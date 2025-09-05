use std::sync::Mutex;

use tauri::{
    menu::{CheckMenuItem, Menu, MenuItem, PredefinedMenuItem, Submenu},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    App, Manager,
};
use tauri_plugin_autostart::ManagerExt;

use crate::{
    config::{self, get_config, Config},
    window::{setup_shortcut_key_config_window, start_capture},
    QuitState,
};

pub fn setup_tray(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let scan_i = MenuItem::with_id(app, "scan", "Scan", true, None::<&str>)?;
    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let separator_i = PredefinedMenuItem::separator(app)?;

    let open_browser = get_config(app.handle()).open_browser;
    let open_browser_i = CheckMenuItem::with_id(
        app,
        "open_browser",
        "Open Browser",
        true,
        open_browser,
        None::<&str>,
    )?;
    let shortcut_key_config_i = MenuItem::with_id(
        app,
        "shortcut_key_config",
        "Shortcut Key",
        true,
        None::<&str>,
    )?;

    let autolaunch = app.autolaunch();
    let auto_start = autolaunch.is_enabled()?;
    let auto_start_i = CheckMenuItem::with_id(
        app,
        "auto_start",
        "Auto Start",
        true,
        auto_start,
        None::<&str>,
    )?;

    let settings_menu = Submenu::with_items(
        app,
        "Settings",
        true,
        &[&open_browser_i, &shortcut_key_config_i, &auto_start_i],
    )?;
    let menu = Menu::with_items(
        app,
        &[&scan_i, &separator_i, &settings_menu, &separator_i, &quit_i],
    )?;

    let _ = TrayIconBuilder::new()
        .icon(tauri::include_image!("./tray_icon.png"))
        .icon_as_template(true)
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_tray_icon_event(|icon, event| match event {
            TrayIconEvent::Click {
                button,
                button_state,
                ..
            } => {
                if button == MouseButton::Left && button_state == MouseButtonState::Up {
                    start_capture(icon.app_handle());
                }
            }
            _ => {}
        })
        .on_menu_event(move |app, event| match event.id.as_ref() {
            "scan" => {
                start_capture(app);
            }
            "open_browser" => {
                let mutex_config = app.state::<Mutex<Config>>();
                let mut config = mutex_config.lock().unwrap();
                config.open_browser = open_browser_i.is_checked().unwrap();
                config::write_config(app, &config).expect("failed to write a config file.");
            }
            "shortcut_key_config" => setup_shortcut_key_config_window(app),
            "auto_start" => {
                let autolaunch = app.autolaunch();
                let auto_start = autolaunch.is_enabled().unwrap();
                auto_start_i.set_checked(!auto_start).unwrap();
                if auto_start {
                    autolaunch.disable().unwrap();
                } else {
                    autolaunch.enable().unwrap();
                }
            }
            "quit" => {
                let app_state_mutex = app.state::<Mutex<QuitState>>();
                let mut app_state = app_state_mutex.lock().unwrap();
                app_state.quitting = true;
                app.exit(0);
            }
            _ => {}
        })
        .build(app)?;
    Ok(())
}
