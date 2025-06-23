import type { BrowserWindow, IpcMainInvokeEvent } from 'electron'

import type { registerRoute } from 'lib/electron-router-dom'

export type BrowserWindowOrNull = Electron.BrowserWindow | null

type Route = Parameters<typeof registerRoute>[0]

export interface WindowProps extends Electron.BrowserWindowConstructorOptions
{
    id: Route['id']
    query?: Route['query']
}

export interface WindowCreationByIPC
{
    channel: string
    window(): BrowserWindowOrNull
    callback(window: BrowserWindow, event: IpcMainInvokeEvent): void
}


// 

export type Region = {
    left: number; // starting X coordinate
    top: number; // starting Y coordinate
    width: number; // width of region
    height: number; // height of region
}

export type Screen = {
    width: number; // width of region
    height: number; // height of region
}

export type Snapshot = {
    id: number;
    title: string; // title of the page
    url: string; // URL of the page to capture
    region: Region; // details of the capture region
    screen: Screen; // details of the screen size
    scrollX: number; // horizontal scroll position of the page
    scrollY: number; // vertical scroll position of the page
    dataUrl?: string;
    timestamp?: number; // last updated
    position: // position of the snapshot image in the canvas
    {
        x: number;
        y: number;
    }
}