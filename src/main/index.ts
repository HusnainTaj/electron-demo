import { app } from 'electron'
import { makeAppWithSingleInstanceLock } from 'lib/electron-app/factories/app/instance'
import { makeAppSetup } from 'lib/electron-app/factories/app/setup'
import { MainWindow } from './windows/main'
import { setupAutoLaunch } from 'lib/electron-app/utils/auto-launch'
import { setupTray } from 'lib/electron-app/utils/setup-tray';
import { setupAutoUpdates } from 'lib/electron-app/utils/auto-updates'

makeAppWithSingleInstanceLock(async () =>
{
    await app.whenReady();

    await makeAppSetup(MainWindow);

    setupAutoLaunch();

    setupTray();

    setupAutoUpdates();
})
