import { useState } from "react"
import
{
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "renderer/components/ui/card"
import { Button } from "./ui/button"
import type { Snapshot } from "shared/types"
import { Edit, Edit2, RefreshCw, Trash } from "lucide-react"
import { cn } from "renderer/lib/utils"

import 'react-advanced-cropper/dist/style.css'
import { NavLink } from "react-router-dom"

const { App } = window

interface Props
{
    snapshot: Snapshot
    snapshotReloading: number
}

export function SnapshotItem({ snapshot, snapshotReloading }: Props)
{
    const [reloading, setReloading] = useState<boolean>(false);

    const busy = reloading || snapshotReloading !== -1;

    async function handleReload()
    {
        try
        {
            setReloading(true);
            const newDataUri = await App.ReloadSnapshot(snapshot);

            snapshot.dataUrl = newDataUri;
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

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="line-clamp-1" title={snapshot.title}>{snapshot.title}</CardTitle>
                <CardDescription className="line-clamp-1" title={snapshot.url}>{snapshot.url}</CardDescription>
                <CardAction className="flex gap-2">
                    <Button size={"icon"} className="size-8" onClick={handleReload} disabled={busy}><RefreshCw className={cn({ "animate-spin": reloading || snapshotReloading === snapshot.id })} /></Button>
                    <Button size={"icon"} variant={"secondary"} className="size-8" disabled={busy}><NavLink to={{ pathname: '/kapture', search: `?snapshotId=${snapshot.id}` }}><Edit2 /></NavLink></Button>
                    <Button size={"icon"} variant={"destructive"} className="size-8" onClick={handleRemove} disabled={busy}><Trash /></Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <img
                    src={snapshot.dataUrl}
                    alt=""
                    className="max-w-full max-h-full object-contain border border-gray-700 rounded shadow-md"
                />
            </CardContent>
        </Card>
    )
}