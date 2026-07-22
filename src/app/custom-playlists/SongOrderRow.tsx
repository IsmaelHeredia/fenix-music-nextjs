import { MOVE_BUTTONS, MoveAction } from './playlist.helpers';

interface SongOrderRowProps {
  index: number;
  title: string;
  playlistName?: string;
  durationString?: string | null;
  isLast: boolean;
  onMove: (action: MoveAction) => void;
  onRemove: () => void;
}

export function SongOrderRow({
  index,
  title,
  playlistName,
  durationString,
  isLast,
  onMove,
  onRemove,
}: SongOrderRowProps) {
  return (
    <div
      className="flex items-center gap-3 px-6 py-3 transition-colors duration-200 hover:bg-[var(--row-hover-bg)]"
      style={{ borderBottom: isLast ? 'none' : '1px solid var(--border-color, rgba(255,255,255,0.04))' }}
    >
      <span className="text-sm w-7 text-right select-none shrink-0" style={{ color: 'var(--text-muted)' }}>
        {index + 1}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium leading-snug truncate" style={{ color: 'var(--text-primary)' }}>
          {title}
        </p>
        {playlistName && (
          <p className="text-sm truncate mt-0.5" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.4))' }}>
            {playlistName}
          </p>
        )}
      </div>

      {durationString && (
        <span className="text-sm tabular-nums shrink-0 mr-1 font-medium" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.6))' }}>
          {durationString}
        </span>
      )}

      <button
        onClick={onRemove}
        aria-label="Quitar canción"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg transition shrink-0"
        style={{
          color: 'rgba(239,68,68,0.6)',
          background: 'transparent',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = 'rgb(239,68,68)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(239,68,68,0.6)';
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        }}
      >
        ×
      </button>

      <div className="flex gap-1 shrink-0">
        {MOVE_BUTTONS.map(({ action, symbol, label }) => (
          <button
            key={action}
            onClick={() => onMove(action)}
            aria-label={label}
            className="w-9 h-9 rounded-lg text-base flex items-center justify-center transition shrink-0"
            style={{
              color: 'var(--accent, #6ee29e)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent, #6ee29e)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(110,226,158,0.08)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent, #6ee29e)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
}