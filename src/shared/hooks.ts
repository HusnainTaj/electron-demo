import { useEffect, useState } from "react";
import type { setupRendererStore } from "preload/storage";

export function useStorage<T>(store: ReturnType<typeof setupRendererStore<T>>, fallback: T): T
{
    const [value, setValue] = useState<T>(fallback);

    useEffect(() =>
    {
        store.get().then(setValue);
        return store.watch(setValue);
    }, [store]);

    return value;
}
