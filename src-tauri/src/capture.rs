use tauri::{command, AppHandle};
use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_opener::OpenerExt;
use xcap::image::{buffer::ConvertBuffer, GrayImage};
use zbar_rust::ZBarSymbolType;

use crate::{
    config::{self},
    platform::mac::notify,
};

#[derive(Debug, serde::Deserialize)]
pub struct CaptureRect {
    x: u32,
    y: u32,
    w: u32,
    h: u32,
}

impl CaptureRect {
    pub fn to_physical(&self, factor: f32) -> Self {
        Self {
            x: (self.x as f32 * factor) as u32,
            y: (self.y as f32 * factor) as u32,
            w: (self.w as f32 * factor) as u32,
            h: (self.h as f32 * factor) as u32,
        }
    }
}

#[command]
pub fn capture(app_handle: AppHandle, rect: CaptureRect, monitor_id: u32) {
    let monitor = xcap::Monitor::all()
        .unwrap()
        .into_iter()
        .filter(|monitor| monitor.id().unwrap() == monitor_id)
        .next()
        .expect("Monitor not found");
    let factor = monitor.scale_factor().unwrap();
    let rect = rect.to_physical(factor);
    let image = monitor.capture_image().unwrap();
    let image = xcap::image::imageops::crop_imm(&image, rect.x, rect.y, rect.w, rect.h).to_image();
    let image: GrayImage = image.convert();
    let (w, h) = image.dimensions();

    let mut scanner = zbar_rust::ZBarImageScanner::new();
    let results = scanner.scan_y800(image.into_raw(), w, h).ok();
    let mut results = match results {
        Some(results)
            if results.len() > 0 && results[0].symbol_type == ZBarSymbolType::ZBarQRCode =>
        {
            results
        }
        _ => {
            notify(
                "QRコードの読み取りに失敗しました",
                "",
                None::<Box<dyn FnOnce() + Send + 'static>>,
            );
            return;
        }
    };
    let content = match String::from_utf8(results.remove(0).data) {
        Ok(content) => content,
        Err(err) => {
            eprintln!("{:?}", err);
            return;
        }
    };

    let open_browser = config::get_config(&app_handle).open_browser;

    if !open_browser || tauri::Url::parse(&content).is_err() {
        notify(
            "QRコードの読み取りに成功しました",
            "クリックしてコピー",
            Some(move || {
                app_handle
                    .clipboard()
                    .write_text(content)
                    .expect("failed to write text");
            }),
        );
        return;
    }

    if let Err(err) = app_handle.opener().open_url(&content, None::<&str>) {
        eprintln!("error open url: {err:?}");
    }
}
