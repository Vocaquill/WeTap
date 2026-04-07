export function MoviePlayer({ src }: { src: string }) {
    return (
        <div className="relative group rounded-3xl overflow-hidden border border-red-600/30 bg-black shadow-2xl shadow-red-600/20">
            <video
                src={src}
                controls
                className="w-full h-full"
            />

            <div className="absolute inset-0 pointer-events-none ring-2 ring-red-600/20 rounded-3xl group-hover:ring-red-600/40 transition" />
        </div>
    );
}
