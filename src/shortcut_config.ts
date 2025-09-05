import hotkeys from "hotkeys-js";
import keymap from "./keymap";
import { platform } from "@tauri-apps/plugin-os";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

type Modifiers = {
    meta: boolean,
    ctrl: boolean ,
    shift: boolean,
    alt: boolean,
}

export default function onLoaded() {
    const scan_shortcut = document.getElementById("scan-shortcut") as HTMLDivElement;
    const shortcut_error = document.getElementById("shortcut-error") as HTMLDivElement;

    invoke("get_registered_shortcut").then(
        (untyped_shortcut) => {
            const shortcut = untyped_shortcut as { modifiers: Modifiers, code: string } | null;
            if(shortcut) {
                let keys = [];
                if(shortcut.modifiers.meta) keys.push("MetaLeft");
                if(shortcut.modifiers.ctrl) keys.push("ControlLeft");
                if(shortcut.modifiers.shift) keys.push("ShiftLeft");
                if(shortcut.modifiers.alt) keys.push("AltLeft");
                keys.push(shortcut.code);
                scan_shortcut.innerText = keys.map(getKeyString).join("");
            }
        }
    );

    document.getElementById("shortcut-close-btn")?.addEventListener("click", () => {
        getCurrentWindow().close();
    });

    let code: string | null = null;
    let modifiers = {
        meta: false,
        ctrl: false,
        shift: false,
        alt: false,
    };
    hotkeys("*", {element: scan_shortcut, keydown: true, keyup: true}, (e) => {(async () => {
        e.preventDefault();
        const curr_modifiers = {
            meta: e.metaKey,
            ctrl: e.ctrlKey,
            shift: e.shiftKey,
            alt: e.altKey,
        };
        const prev = (modifiers.meta ? 0b1000 : 0) | (modifiers.ctrl ? 0b100 : 0) | (modifiers.shift ? 0b10 : 0) | (modifiers.alt ? 0b1 : 0);
        const curr = (curr_modifiers.meta ? 0b1000 : 0) | (curr_modifiers.ctrl ? 0b100 : 0) | (curr_modifiers.shift ? 0b10 : 0) | (curr_modifiers.alt ? 0b1 : 0);

        function check_error(success: boolean, error_msg: string): boolean {
            if(success) {
                shortcut_error.innerText = "";
                scan_shortcut.classList.remove("error");
            }else {
                shortcut_error.innerText = error_msg;
                scan_shortcut.classList.add("error");
            }
            return success;
        }

        if(prev !== curr) {
            modifiers = curr_modifiers;
        }else if(e.type === "keydown") {
            code = e.code;
            if(code === "Escape") {
                scan_shortcut.innerText = "";
                check_error(await invoke("unregister_capture_shortcut") as boolean, "ショートカットを解除出来ません。");
                return;
            }
            let keys = [];
            if(modifiers.meta) keys.push("MetaLeft");
            if(modifiers.ctrl) keys.push("ControlLeft");
            if(modifiers.shift) keys.push("ShiftLeft");
            if(modifiers.alt) keys.push("AltLeft");
            if(keys.length === 0) return;
            keys.push(code);
            if(check_error(await invoke("register_capture_shortcut", { modifiers, code }) as boolean, "このショートカットは設定出来ません。")) {
                scan_shortcut.innerText = keys.map(getKeyString).join("");
            }
        }
    })()});
}

function getKeyString(keycode: string): string {
    const a = keymap[keycode];
    if(a.type === "common") {
        return a.char;
    }else {
        switch(platform()) {
            case "macos":
                return a.macos;
            case "windows":
            default:
                return a.windows;
        }
    }
}
