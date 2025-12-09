import { Event, listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

type Payload = {
    type: "progress",
    downloaded: number,
    total: number | null
} | {
    type: "complete"
} | {
    type: "failed"
}

export default function onLoaded() {
    const icon = document.getElementById("update-icon")! as HTMLImageElement;
    const title = document.getElementById("update-title")! as HTMLHeadingElement;
    const progressBar = document.getElementById("update-progress")! as HTMLProgressElement;
    const progressPercentLabel = document.getElementById("update-progress-percent-label")! as HTMLLabelElement;
    const progressSizeLabel = document.getElementById("update-progress-size-label")! as HTMLDivElement;
    const relaunchBtn = document.getElementById("update-relaunch-btn")! as HTMLButtonElement;
    const closeBtn = document.getElementById("update-close-btn")! as HTMLButtonElement;
    const skipBtn = document.getElementById("update-skip-btn")! as HTMLButtonElement;
    const updateBtn = document.getElementById("update-update-btn")! as HTMLButtonElement;

    skipBtn.addEventListener("click", () => {
        getCurrentWindow().close();
    });

    let blinkIntervalId: number | null = null;
    updateBtn.addEventListener("click", async () => {
        skipBtn.classList.add("hidden");
        updateBtn.classList.add("hidden");
        closeBtn.classList.remove("hidden");
        relaunchBtn.classList.remove("hidden");
        progressBar.classList.remove("hidden");
        progressPercentLabel.classList.remove("hidden");
        progressSizeLabel.classList.remove("hidden");
        title.classList.add("update-title-updating");
        title.innerText = "更新中...";
        blinkIntervalId = setInterval(() => {
            if(title.innerText.endsWith("...")) {
                title.innerText = "更新中";
            }else {
                title.innerText += ".";
            }
        }, 500);

        await invoke("start_update");
    });

    relaunchBtn.addEventListener("click", async () => {
        await invoke("relaunch");
    });
    closeBtn.addEventListener("click", () => {
        getCurrentWindow().close();
    });

    icon.hidden = false;

    listen("update-status", (e: Event<Payload>) => {
        const payload = e.payload;
        switch(payload.type) {
            case "progress":
                const downloadedMB = Math.round(payload.downloaded / 10000) / 100;
                if(payload.total == null) {
                    progressBar.ariaBusy = "true";
                    progressPercentLabel.innerText = "-%";
                    progressSizeLabel.innerText = "MB/-MB";
                }else {
                    const totalMB = Math.round(payload.total / 10000) / 100;
                    const percent = Math.round(payload.total === 0 ? 0 : payload.downloaded / payload.total * 100);
                    progressPercentLabel.innerText = `${percent}%`;
                    progressSizeLabel.innerText = `${downloadedMB}MB/${totalMB}MB`;
                    progressBar.ariaBusy = "false";
                    progressBar.max = payload.total;
                    progressBar.value = payload.downloaded;
                }
                return;
            case "complete":
                relaunchBtn.disabled = false;
                closeBtn.disabled = false;
                if(blinkIntervalId) clearInterval(blinkIntervalId);
                title.classList.remove("update-title-updating");
                title.innerText = "更新完了";
                break;
            case "failed":
                closeBtn.disabled = false;
                title.innerText = "更新に失敗しました";
                break;
        }
    });
}
