use std::sync::Mutex;

use serde::{Deserialize, Serialize};
use tauri::{command, AppHandle, Manager};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

use crate::{
    config::{self, get_config, Config, ShortcutConfig},
    window::start_capture,
};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct ModifierBoolFlags {
    pub meta: bool,
    pub ctrl: bool,
    pub shift: bool,
    pub alt: bool,
}

impl From<ModifierBoolFlags> for Modifiers {
    fn from(value: ModifierBoolFlags) -> Self {
        let mut mods = Modifiers::empty();
        if value.meta {
            mods |= Modifiers::META;
        }
        if value.ctrl {
            mods |= Modifiers::CONTROL;
        }
        if value.shift {
            mods |= Modifiers::SHIFT;
        }
        if value.alt {
            mods |= Modifiers::ALT;
        }
        mods
    }
}

#[derive(Default)]
pub struct Shortcuts {
    pub capture: Option<Shortcut>,
}

pub fn setup_shortcut(app: &AppHandle) {
    let config = get_config(app);
    if let Some(capture_shortcut) = config.capture_shortcut {
        let ShortcutConfig { modifiers, code } = capture_shortcut;
        register_capture_shortcut_without_save(app, modifiers, code)
            .expect("failed to register capture shortcut.");
    }
}

pub fn register_capture_shortcut_without_save(
    app: &AppHandle,
    modifiers: ModifierBoolFlags,
    code: Code,
) -> Result<(), tauri_plugin_global_shortcut::Error> {
    let new_shortcut = Shortcut::new(Some(modifiers.into()), code);
    let shortcut = app
        .state::<Mutex<Shortcuts>>()
        .lock()
        .unwrap()
        .capture
        .replace(new_shortcut);
    let global_shortcut = app.global_shortcut();
    if let Some(shortcut) = shortcut {
        if global_shortcut.is_registered(shortcut) {
            global_shortcut.unregister(shortcut)?;
        }
    }
    global_shortcut.on_shortcut(new_shortcut, |app, _shortcut, event| {
        if event.state == ShortcutState::Pressed {
            start_capture(app);
        }
    })?;
    Ok(())
}

#[command]
pub fn register_capture_shortcut(app: AppHandle, modifiers: ModifierBoolFlags, code: Code) -> bool {
    if register_capture_shortcut_without_save(&app, modifiers, code).is_err() {
        return false;
    }
    let mutex_config = app.state::<Mutex<Config>>();
    let mut config = mutex_config.lock().unwrap();
    config.capture_shortcut = Some(ShortcutConfig { code, modifiers });
    config::write_config(&app, &config).expect("failed to write a config file.");
    true
}

pub fn unregister_capture_shortcut_without_save(
    app: &AppHandle,
) -> Result<(), tauri_plugin_global_shortcut::Error> {
    let shortcut = app.state::<Mutex<Shortcuts>>().lock().unwrap().capture;
    if let Some(shortcut) = shortcut {
        app.global_shortcut().unregister(shortcut)?;
        app.state::<Mutex<Shortcuts>>().lock().unwrap().capture = None;
    }
    Ok(())
}

#[command]
pub fn unregister_capture_shortcut(app: AppHandle) -> bool {
    let success = unregister_capture_shortcut_without_save(&app).is_ok();
    let mutex_config = app.state::<Mutex<Config>>();
    let mut config = mutex_config.lock().unwrap();
    config.capture_shortcut = None;
    config::write_config(&app, &config).expect("failed to write a config file.");
    success
}

#[command]
pub fn get_registered_shortcut(app: AppHandle) -> Option<ShortcutConfig> {
    let mutex_config = app.state::<Mutex<Config>>();
    let config = mutex_config.lock().unwrap();
    config.capture_shortcut
}
