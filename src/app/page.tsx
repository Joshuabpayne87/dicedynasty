export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-dynasty-dark">
            <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
                <h1 className="text-6xl font-bold text-dynasty-gold animate-pulse">Dice Dynasty</h1>
                <p className="text-xl text-gray-300">Roll the Dice. Build your Dynasty.</p>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-dynasty-gold text-dynasty-dark font-bold rounded hover:bg-yellow-400 transition">
                        Start Draft
                    </button>
                    <button className="px-6 py-3 border border-dynasty-gold text-dynasty-gold font-bold rounded hover:bg-dynasty-gold/10 transition">
                        Login
                    </button>
                </div>
            </div>
        </main>
    );
}
