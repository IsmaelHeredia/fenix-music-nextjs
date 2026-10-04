import { Bar } from '@/components/skeletons/Bar';

const cardStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border-color)' };

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Bar strong className="h-8 w-48 rounded" />
      <Bar className="h-4 w-64 rounded" />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`rounded-2xl p-4 space-y-3 ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}
          style={cardStyle}
        >
          <div className="flex items-center gap-2">
            <Bar strong className="w-5 h-5 rounded" delay={i * 0.1} />
            <Bar className="h-4 w-16 rounded" delay={i * 0.1} />
          </div>
          <Bar strong className="h-8 w-12 rounded" delay={i * 0.1} />
          <Bar className="h-3.5 w-20 rounded" delay={i * 0.1} />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-2xl p-5 space-y-4" style={cardStyle}>
          <div className="flex items-center gap-2">
            <Bar strong className="w-5 h-5 rounded" />
            <Bar strong className="h-5 w-32 rounded" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3 p-2">
                {i === 0 && <Bar strong className="w-2.5 h-2.5 rounded-full shrink-0" delay={j * 0.1} />}
                <div className="flex-1 space-y-2">
                  <Bar strong className="h-4 w-3/4 rounded" delay={j * 0.1} />
                  <Bar className="h-3 w-1/2 rounded" delay={j * 0.1} />
                </div>
                {i === 1 && <Bar strong className="h-7 w-20 rounded-lg shrink-0" delay={j * 0.1} />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);