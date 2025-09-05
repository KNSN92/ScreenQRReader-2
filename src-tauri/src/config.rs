use std::{
    fs::{create_dir_all, read_to_string, write},
    sync::Mutex,
};

use serde::{Deserialize, Serialize};
use tauri::{App, AppHandle, Manager};

use crate::shortcut::ModifierBoolFlags;

use tauri_plugin_global_shortcut::Code;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Config {
    pub open_browser: bool,
    pub capture_shortcut: Option<ShortcutConfig>,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            open_browser: true,
            capture_shortcut: None,
        }
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct ShortcutConfig {
    pub modifiers: ModifierBoolFlags,
    pub code: Code,
}

pub fn setup_config(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    let config_path_buf = app.path().app_config_dir()?;
    if !config_path_buf.exists() {
        create_dir_all(&config_path_buf)?;
    }
    let config_path_buf = config_path_buf.join("config.json");
    if !config_path_buf.exists() {
        write(
            config_path_buf.clone(),
            serde_json::to_string_pretty(&Config::default())?,
        )?;
    }
    let config = serde_json::from_str::<Config>(&read_to_string(config_path_buf)?)?;
    app.manage(Mutex::new(config));
    Ok(())
}

pub fn get_config(app: &AppHandle) -> Config {
    let mutex_config = app.state::<Mutex<Config>>();
    let config = mutex_config.lock().expect("poisoned config").clone();
    config
}

pub fn write_config(app: &AppHandle, config: &Config) -> Result<(), Box<dyn std::error::Error>> {
    let config_path_buf = app.path().app_config_dir()?;
    if !config_path_buf.exists() {
        create_dir_all(&config_path_buf)?;
    }
    let config_path_buf = config_path_buf.join("config.json");
    write(
        config_path_buf.clone(),
        serde_json::to_string_pretty(config)?,
    )?;
    Ok(())
}
