import { Menu, screen } from 'electron'
import { join } from 'node:path'
import { createWindow } from 'lib/electron-app/factories/windows/create'
import { ENVIRONMENT } from 'shared/constants'
import { displayName, resources } from '~/package.json'

export async function MainWindow()
{
    const window = createWindow({
        id: 'main',
        title: displayName,
        width: 1200,
        height: 800,
        show: false,
        center: true,
        autoHideMenuBar: true,
        icon: ENVIRONMENT.IS_DEV ? `${resources}/build/icons/dark/icon.ico` : `${resources}/build/icons/icon.ico`,

        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            webviewTag: true,
            devTools: ENVIRONMENT.IS_DEV,
            sandbox: false, // required for v8 bytecode
        },
    });

    if (!ENVIRONMENT.IS_DEV) Menu.setApplicationMenu(null);


    // TODO: check if needed
    // Workaround for when run in --hidden mode, as we can not call maximize
    // probably need to somehow check in tray show that if it is first time
    // showing the window, we should maximize it
    window.setBounds(screen.getPrimaryDisplay().workArea);

    if (ENVIRONMENT.IS_DEV) window.setBounds(screen.getAllDisplays()[0].workArea); // TODO: only for dev, remove later

    window.webContents.on('did-finish-load', () =>
    {
        if (ENVIRONMENT.IS_DEV)
        {
            window.webContents.openDevTools({ mode: 'bottom' })
        }

        if (!process.argv.includes('--hidden'))
        {
            window.maximize();
            window.show();
        }
    });

    window.on('close', (event) =>
    {
        event.preventDefault();
        window.hide();

        return false;
    });

    return window
}
