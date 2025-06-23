import { memo, useState } from "react"
import { Button } from "./ui/button"
import type { Snapshot } from "shared/types"
import { ArrowUpRightFromSquareIcon, Edit2, RefreshCw, Trash } from "lucide-react"
import { cn } from "renderer/lib/utils"
import { NodeToolbar, Position } from "@xyflow/react"
import { NavLink } from "react-router-dom"
import TextTip from "./TextTip"

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
        <>
            <h1 className="text-3xl font-bold text-balance pb-4">{snapshot.title}</h1>
            <div className="relative bg-card text-card-foreground flex flex-col gap-6 rounded overflow-hidden border-2 p-0 shadow-sm hover:border-amber-50">
                <div style={{
                    backgroundImage: `url(${snapshot.dataUrl})`,
                    width: snapshot.region.width,
                    height: snapshot.region.height,
                    backgroundPosition: `-${snapshot.region.left}px -${snapshot.region.top}px`,
                }} className="">
                    {/* asdasd */}
                </div>

                {(reloading || snapshotReloading === snapshot.id) && (
                    <div className="absolute h-full w-full bg-black/50 flex items-center justify-center">
                        <RefreshCw size={60} className={cn("text-white animate-spin")} />
                    </div>
                )}

                <NodeToolbar className="flex max-w-xl gap-6 bg-background rounded-lg p-2 border" position={Position.Bottom}>
                    {/* <div className="grow flex flex-col justify-center">
                        <p className="line-clamp-1 text-sm font-semibold" title={snapshot.title}>{snapshot.title}</p>
                        <p className="line-clamp-1 text-xs text-muted-foreground text-[0.625rem]" title={snapshot.title}>{new Date(snapshot.timestamp || 0).toLocaleString()}</p>
                    </div> */}
                    <div className="flex items-center">
                        <TextTip tip="Refresh">
                            <Button size={"icon"} variant={"ghost"} className="size-8" onClick={handleReload} disabled={busy}><RefreshCw className={cn({ "animate-spin": reloading || snapshotReloading === snapshot.id })} /></Button>
                        </TextTip>
                        <TextTip tip="Open in new window">
                            <Button size={"icon"} variant={"ghost"} className="size-8" onClick={() => App.CreateWindow(snapshot.url)} disabled={busy}><ArrowUpRightFromSquareIcon /></Button>
                        </TextTip>
                        <TextTip tip="Edit">
                            <Button size={"icon"} variant={"ghost"} className="size-8" disabled={busy}><NavLink state={{ snapshot }} to={{ pathname: '/kapture', search: `?snapshotId=${snapshot.id}` }}><Edit2 /></NavLink></Button>
                        </TextTip>
                        <TextTip tip="Delete">
                            <Button size={"icon"} variant={"ghost"} className="size-8 hover:bg-rose-600/60!" onClick={handleRemove} disabled={busy}><Trash /></Button>
                        </TextTip>
                    </div>
                </NodeToolbar>
            </div>
        </>
    )
});