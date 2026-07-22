export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <div className="h-8 bg-white/10 rounded animate-pulse w-48" />
      <div className="h-4 bg-white/[0.06] rounded animate-pulse w-64" />
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div 
          key={i} 
          className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 space-y-2 relative overflow-hidden"
        >
          <div 
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]" 
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)' }} 
          />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white/10 rounded animate-pulse" />
            <div className="h-4 bg-white/[0.06] rounded animate-pulse w-16" />
          </div>
          <div className="h-8 bg-white/10 rounded animate-pulse w-12" />
          <div className="h-4 bg-white/[0.06] rounded animate-pulse w-20" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div 
          key={i} 
          className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-3 relative overflow-hidden"
        >
          <div 
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]" 
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)' }} 
          />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white/10 rounded animate-pulse" />
            <div className="h-5 bg-white/10 rounded animate-pulse w-32" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3 p-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-white/[0.06] rounded animate-pulse w-1/2" />
                </div>
                {i === 1 && (
                  <div className="h-7 w-16 bg-white/10 rounded-lg animate-pulse shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);