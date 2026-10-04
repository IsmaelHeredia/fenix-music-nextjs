import { Bar } from '@/components/skeletons/Bar';

export function HeaderSkeleton() {
  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Bar className="h-3.5 w-16 rounded" />
        <Bar className="h-3.5 w-2 rounded" />
        <Bar className="h-3.5 w-16 rounded" />
        <Bar className="h-3.5 w-2 rounded" />
        <Bar strong className="h-3.5 w-28 rounded" />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
        <div className="flex items-end gap-4 sm:gap-5">
          <Bar strong className="w-16 h-16 sm:w-[88px] sm:h-[88px] rounded-2xl shrink-0" />
          <div className="space-y-2.5 pb-1">
            <Bar className="h-3 w-20 rounded" />
            <Bar strong className="h-7 w-56 rounded" />
            <Bar className="h-3 w-40 rounded" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pb-1 w-full lg:w-auto">
          <div
            className="h-11 w-44 rounded-xl overflow-hidden relative shrink-0"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <Bar className="absolute inset-0 rounded-xl" />
          </div>
          <div
            className="h-11 w-56 rounded-xl overflow-hidden relative flex-1 min-w-[180px] sm:flex-none"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <Bar className="absolute inset-0 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}