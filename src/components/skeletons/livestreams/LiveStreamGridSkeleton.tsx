export function LiveStreamGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={i} 
          className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden relative"
        >
          <div 
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
            }}
          />
          
          <div className="p-6 relative z-10 flex flex-col items-center justify-center min-h-[220px]">
            <div className="mb-5 w-16 h-16 rounded-full bg-white/5 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.2s]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }} />
            </div>
            
            <div className="h-5 bg-white/10 rounded animate-pulse w-3/4 mb-2 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.4s]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }} />
            </div>
            
            <div className="h-6 bg-white/5 rounded-full animate-pulse w-20 mt-2 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.6s]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }} />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              <div className="h-8 bg-white/5 rounded-lg animate-pulse w-16 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.8s]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }} />
              </div>
              <div className="h-8 bg-white/5 rounded-lg animate-pulse w-20 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_1s]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }} />
              </div>
              {i % 2 === 0 && (
                <div className="h-8 bg-white/5 rounded-lg animate-pulse w-14 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_1.2s]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }} />
                </div>
              )}
            </div>
          </div>
          
          <div className="absolute top-4 right-4 z-20">
            <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.3s]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}