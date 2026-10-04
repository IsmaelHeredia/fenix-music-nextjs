import type { CSSProperties } from 'react';

interface BarProps {
  className?: string;
  style?: CSSProperties;
  strong?: boolean;
  delay?: number;
}

export function Bar({ className = '', style, strong = false, delay = 0 }: BarProps) {
  return (
    <div
      className={`relative overflow-hidden animate-pulse ${className}`}
      style={{ background: strong ? 'var(--bg-active)' : 'var(--bg-hover)', ...style }}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
}