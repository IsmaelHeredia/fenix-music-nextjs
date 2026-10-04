import { Bar } from '@/components/skeletons/Bar';

export function StationGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => {
        const delay = (i % 4) * 0.12;
        return (
          <div
            key={i}
            className="rounded-2xl overflow-hidden relative"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div className="p-6 flex flex-col items-center justify-center min-h-[220px]">
              <Bar strong className="mb-5 w-16 h-16 rounded-full" delay={delay} />
              <Bar strong className="h-5 w-3/4 rounded mb-2" delay={delay} />
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                <Bar className="h-9 w-16 rounded-lg" delay={delay} />
                <Bar className="h-9 w-20 rounded-lg" delay={delay} />
                {i % 2 === 0 && <Bar className="h-9 w-14 rounded-lg" delay={delay} />}
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Bar className="w-8 h-8 rounded-lg" delay={delay} />
            </div>
          </div>
        );
      })}
    </div>
  );
}