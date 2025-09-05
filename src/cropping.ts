import { invoke } from "@tauri-apps/api/core";
import { getAllWindows, getCurrentWindow } from "@tauri-apps/api/window";

type MousePosition = {x: number, y: number}

async function closeWindow() {
  const windows = await getAllWindows();
  for(const window of windows) {
    if(!window.label.startsWith("cropping:")) continue;
    await window.close()
  }
}

async function hideWindow() {
  const windows = await getAllWindows();
  for(const window of windows) {
    if(!window.label.startsWith("cropping:")) continue;
    await window.hide()
  }
}

export default function onLoaded() {
  getCurrentWindow().setFocus();

  addEventListener("keydown", (e) => {
    if(e.code === "Escape") {
      closeWindow();
    }
  });

  let moving = false;
  let mouse_origin: MousePosition | null = null;
  const area = document.getElementById("area");
  const pos = document.getElementById("pos");
  if(!area) return;

  document.documentElement.onmousedown = (e) => {
    mouse_origin = { x: e.screenX, y: e.screenY };
    moving = true;
  }
  document.documentElement.onmousemove = (e) => {
    if(pos) {
      pos.style.left = `${e.screenX}px`;
      pos.style.top  = `${e.screenY}px`;
      pos.innerHTML = `${e.screenX}<br>${e.screenY}`;
    }
    if(!moving || !mouse_origin) return;
    const origin_x = mouse_origin.x;
    const origin_y = mouse_origin.y;
    const current_x = e.screenX;
    const current_y = e.screenY;

    area.style.left = `${Math.min(origin_x, current_x)}px`;
    area.style.top  = `${Math.min(origin_y, current_y)}px`;
    area.style.width  = `${Math.abs(origin_x - current_x)}px`;
    area.style.height = `${Math.abs(origin_y - current_y)}px`;
  }
  document.documentElement.onmouseup = async (e) => {
    if(!moving || !mouse_origin) return;
    const origin_x = mouse_origin.x;
    const origin_y = mouse_origin.y;
    const current_x = e.screenX;
    const current_y = e.screenY;

    moving = false;
    const left_top:     MousePosition = { x: Math.min(origin_x, current_x) , y: Math.min(origin_y, current_y) };
    const right_bottom: MousePosition = { x: Math.max(origin_x, current_x) , y: Math.max(origin_y, current_y) };
    if(left_top.x != right_bottom.x || left_top.y != right_bottom.y) {
      await hideWindow();
      const window = getCurrentWindow();
      const monitor_id = parseInt(window.label.split(":")[1]);
      invoke("capture", {
        monitorId: monitor_id,
        rect: {
          x: left_top.x,
          y: left_top.y,
          w: Math.abs(right_bottom.x - left_top.x),
          h: Math.abs(right_bottom.y - left_top.y),
        }
      });
    }
    closeWindow();
  }
}
