import { contextBridge } from 'electron'

declare global
{
    interface Window
    {
        App: typeof API
    }
}

const API = {

};

contextBridge.exposeInMainWorld('App', API);
