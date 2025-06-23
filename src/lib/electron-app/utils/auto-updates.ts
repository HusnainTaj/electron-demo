import { BrowserWindow, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import { ENVIRONMENT } from "shared/constants";

// autoUpdater.forceDevUpdateConfig = true; // Force dev update config
if (ENVIRONMENT.IS_DEV)
{
    // both are true when not in dev
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
}

export function setupAutoUpdates()
{
    autoUpdater.on("update-downloaded", async (e) =>
    {
        const { response } = await dialog.showMessageBox(BrowserWindow.getAllWindows()[0], {
            type: "info",
            title: "Update Downloaded!",
            message: "An update has been downloaded. Restart and install it now?",
            buttons: ["No", "Yes"],
            noLink: true,
            cancelId: 0, // "No"
            defaultId: 1, // "Yes"

        });

        if (response === 1) // Restart Now
            autoUpdater.quitAndInstall(false, true);
    })

    autoUpdater.checkForUpdates();
}