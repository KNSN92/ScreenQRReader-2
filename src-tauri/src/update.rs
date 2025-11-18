use serde::Serialize;
use tauri::{
    command,
    utils::{config::WindowEffectsConfig, WindowEffect},
    AppHandle, Emitter, WebviewUrl, WebviewWindow, WebviewWindowBuilder,
};
use tauri_plugin_updater::UpdaterExt;

#[derive(Debug, Serialize, Clone, Copy)]
#[serde(rename_all = "camelCase", tag = "type")]
enum UpdateStatus {
    Progress {
        downloaded: usize,
        total: Option<u64>,
    },
    Complete,
    Failed,
}

pub async fn check_update(app: AppHandle) {
    if app.updater().unwrap().check().await.unwrap().is_some()
        || option_env!("ALWAYS_OPEN_UPDATE_WINDOW").is_some()
    {
        create_window(&app);
    }
}

#[command]
pub async fn start_update(app: AppHandle) {
    if let Some(update) = app.updater().unwrap().check().await.unwrap() {
        let mut downloaded = 0;
        let update_failed = update
            .download_and_install(
                |chunk_length, content_length| {
                    downloaded += chunk_length;
                    app.emit(
                        "update-status",
                        UpdateStatus::Progress {
                            downloaded,
                            total: content_length,
                        },
                    )
                    .unwrap();
                },
                || {
                    app.emit("update-status", UpdateStatus::Complete).unwrap();
                },
            )
            .await
            .is_err();
        if update_failed {
            app.emit("update-status", UpdateStatus::Failed).unwrap();
        }
    }
}

#[command]
pub fn relaunch(app: AppHandle) {
    app.restart();
}

fn create_window(app: &AppHandle) -> WebviewWindow {
    WebviewWindowBuilder::new(app, "updater", WebviewUrl::App("index.html".into()))
        .inner_size(300., 150.)
        .focused(true)
        .resizable(false)
        .transparent(true)
        .effects(WindowEffectsConfig {
            effects: vec![WindowEffect::FullScreenUI],
            radius: Some(10.),
            ..Default::default()
        })
        .build()
        .unwrap()
}
