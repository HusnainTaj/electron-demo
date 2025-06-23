import { BrowserWindow, Menu, Tray, app, nativeImage } from 'electron'
import { displayName } from '~/package.json'
import appIcon from '~/src/resources/build/icons/icon.ico?asset'

let tray: Tray | null = null
export function setupTray()
{
    // close to tray setup, probably should add ability to configure it in some sort of settings
    tray = new Tray(nativeImage.createFromPath(appIcon))
    tray.setToolTip(displayName)
    tray.addListener('double-click', () =>
    {
        let allHidden = true;
        const allWindows = BrowserWindow.getAllWindows();
        for (const window of allWindows)
            if (window.isVisible()) allHidden = false;

        for (const window of allWindows)
        {
            if (allHidden) window.show();
            else window.hide();
        }
    });
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Show', click: () =>
            {
                for (const window of BrowserWindow.getAllWindows())
                {
                    window.show()
                }
            }
        },
        {
            label: 'Quit', click: () =>
            {
                for (const window of BrowserWindow.getAllWindows())
                {
                    window.destroy()
                }

                app.quit()
            }
        }
    ]));
}