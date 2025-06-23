// The "App" comes from the context bridge in preload/index.ts
const { App } = window

export function MainScreen()
{

    return (
        <main className="flex flex-col p-4 h-screen bg-black">
            <h1 className='text-5xl font-bold'>Electron React Demo</h1>
        </main>
    )
}
