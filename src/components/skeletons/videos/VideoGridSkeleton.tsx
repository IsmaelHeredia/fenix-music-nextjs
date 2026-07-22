export function VideoGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-white/10 rounded animate-pulse w-3/4" />
                            <div className="h-2 bg-white/[0.06] rounded animate-pulse w-1/2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}