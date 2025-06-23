import type { Snapshot } from "./types";

export type StoreConfig<T> = {
    filename: string;
    key: string;
    fallback: T;
};

export const StoreConfigs = {
    "snapshots": {
        filename: "snapshots",
        key: "snapshots",
        fallback: [] as Snapshot[],
    } as StoreConfig<Snapshot[]>,
    "settings": {
        filename: "settings",
        key: "settings",
        fallback: { "run-at-startup": false, "auto-refresh": true } as Settings,
    } as StoreConfig<Settings>,
    "interval": {
        filename: "interval",
        key: "interval",
        fallback: "never", // default interval in milliseconds
    } as StoreConfig<string>,
}

export interface Settings
{
    "run-at-startup": boolean;
    "auto-refresh": boolean;
}