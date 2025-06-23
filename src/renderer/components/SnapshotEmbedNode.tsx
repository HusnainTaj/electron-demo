import { memo, useState } from "react"
import { Button } from "./ui/button"
import type { Snapshot } from "shared/types"
import { Edit2, RefreshCw, Trash } from "lucide-react"
import { cn } from "renderer/lib/utils"
import { NodeToolbar } from "@xyflow/react"
import { NavLink } from "react-router-dom"

const { App } = window

interface Props
{
    snapshot: Snapshot
    snapshotReloading: number
}

export default memo(({ data }: { data: Props }) =>
{
    const { snapshot, snapshotReloading } = data;
    const [reloading, setReloading] = useState<boolean>(false);

    const busy = reloading || snapshotReloading !== -1;

    async function handleReload()
    {
        try
        {
            setReloading(true);
            const newDataUri = await App.ReloadSnapshot(snapshot);

            snapshot.dataUrl = newDataUri;
            snapshot.timestamp = Date.now(); // Update timestamp to current time
            const snapshots = await App.snapshotsStore.get();
            App.snapshotsStore.set(snapshots.map(s => s.id === snapshot.id ? snapshot : s));

        } catch (error)
        {
            console.error('Error loading screenshot:', error)
        }
        finally
        {
            setReloading(false);
        }
    }

    async function handleRemove()
    {
        const snapshots = await App.snapshotsStore.get();
        App.snapshotsStore.set(snapshots.filter(s => s.id !== snapshot.id));
    }

    // <h1 className="text-4xl font-bold text-balance pb-4">{snapshot.title}</h1>


    return (
        <div
            style={{
                width: snapshot.region.width,
                height: snapshot.region.height,
            }}
            className="relative bg-card text-card-foreground flex flex-col gap-6 rounded-lg overflow-hidden border-2 p-0 shadow-sm hover:border-amber-50">

            <webview
                style={{
                    position: 'absolute',
                    width: snapshot.screen.width,
                    height: snapshot.screen.height,
                    top: -snapshot.region.top,
                    left: -snapshot.region.left,
                }}
                className='w-full h-full' src={snapshot.url || undefined} />

            {(reloading || snapshotReloading === snapshot.id) && (
                <div className="absolute h-full w-full bg-black/50 flex items-center justify-center">
                    <RefreshCw size={60} className={cn("text-white animate-spin")} />
                </div>
            )}

            <NodeToolbar className="flex max-w-xl gap-6 bg-background rounded-lg p-2 border">
                <div className="grow flex flex-col justify-center">
                    <p className="line-clamp-1 text-sm font-semibold" title={snapshot.title}>{snapshot.title}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground text-[0.625rem]" title={snapshot.title}>{new Date(snapshot.timestamp || 0).toLocaleString()}</p>
                </div>
                <div className="flex items-center">
                    <Button size={"icon"} variant={"ghost"} className="size-8" onClick={handleReload} disabled={busy}><RefreshCw className={cn({ "animate-spin": reloading || snapshotReloading === snapshot.id })} /></Button>
                    <Button size={"icon"} variant={"ghost"} className="size-8" disabled={busy}><NavLink state={{ snapshot }} to={{ pathname: '/kapture', search: `?snapshotId=${snapshot.id}` }}><Edit2 /></NavLink></Button>
                    <Button size={"icon"} variant={"ghost"} className="size-8 hover:bg-rose-600/60!" onClick={handleRemove} disabled={busy}><Trash /></Button>
                </div>
            </NodeToolbar>
        </div>
    )
});