import { Bar } from '@/components/skeletons/Bar';

const cardStyle = { background: 'var(--bg-card)', border: '1px solid var(--border-color)' };

export const SettingsSkeleton = () => (
  <div className="space-y-6">
    <div className="rounded-2xl p-6 space-y-4" style={cardStyle}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Bar strong className="w-10 h-10 rounded-xl shrink-0" />
          <Bar strong className="h-6 w-48 rounded" delay={0.1} />
        </div>
        <Bar className="h-10 w-36 rounded-xl" delay={0.2} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Bar className="h-3 w-24 rounded" delay={0.3} />
          <Bar strong className="h-11 rounded-xl" delay={0.35} />
        </div>
        <div className="space-y-2">
          <Bar className="h-3 w-24 rounded" delay={0.4} />
          <Bar strong className="h-11 rounded-xl" delay={0.45} />
        </div>
      </div>
    </div>

    <div className="rounded-2xl p-6" style={cardStyle}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <Bar strong className="w-10 h-10 rounded-xl shrink-0" delay={0.2} />
            <Bar strong className="h-6 w-40 rounded" delay={0.3} />
          </div>
          <Bar className="ml-[3.25rem] h-3 w-64 max-w-full rounded" delay={0.4} />
        </div>
        <Bar className="h-12 w-36 rounded-xl" delay={0.5} />
      </div>
    </div>
  </div>
);