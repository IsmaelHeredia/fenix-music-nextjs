import { Bar } from '@/components/skeletons/Bar';

export function PlaylistGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 p-4 rounded-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <Bar strong className="w-full aspect-square rounded-xl" delay={(i % 5) * 0.12} />
          <div className="space-y-2">
            <Bar strong className="h-4 w-3/4 rounded" delay={(i % 5) * 0.12} />
            <Bar className="h-3 w-1/2 rounded" delay={(i % 5) * 0.12} />
            <div className="pt-2.5 mt-1 space-y-1.5">
              <Bar className="h-2.5 w-16 rounded" delay={(i % 5) * 0.12} />
              <Bar className="h-2 w-12 rounded" delay={(i % 5) * 0.12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}