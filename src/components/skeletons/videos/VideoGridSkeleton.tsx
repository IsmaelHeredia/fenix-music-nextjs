import { Bar } from '@/components/skeletons/Bar';

export function VideoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center gap-3">
            <Bar strong className="w-12 h-12 rounded-xl shrink-0" delay={(i % 3) * 0.12} />
            <div className="flex-1 space-y-2">
              <Bar strong className="h-3.5 w-3/4 rounded" delay={(i % 3) * 0.12} />
              <Bar className="h-2.5 w-1/2 rounded" delay={(i % 3) * 0.12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}