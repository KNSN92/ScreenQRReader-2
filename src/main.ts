import { getCurrentWindow } from "@tauri-apps/api/window";
import onLoadedCropping from "./cropping";
import onLoadedShortcutConfig from "./shortcut_config"
import onLoadedUpdater from "./updater"


const window_label = getCurrentWindow().label;

let onLoaded = null;
let usingWindowId = null;
if(window_label.startsWith("cropping")) {
  onLoaded = onLoadedCropping;
  usingWindowId = "cropping";
}else if(window_label === "shortcut_config") {
  onLoaded = onLoadedShortcutConfig;
  usingWindowId = "shortcut-config";
}else if(window_label === "updater") {
  onLoaded = onLoadedUpdater;
  usingWindowId = "updater";
}else {
  console.error("Unknown window label:", window_label);
}

if(onLoaded) {
  addEventListener("DOMContentLoaded", () => {
    const window_elements = document.getElementsByClassName("hidden");
    for(let i = window_elements.length - 1; i >= 0; i--) {
      const window_element = window_elements.item(i);
      if(!window_element || !window_element.classList.contains("window")) continue;
      if(window_element.id === usingWindowId) {
        window_element.classList.remove("hidden");
      }else {
        window_element.remove();
      }
    }
    onLoaded();
  });
}
