'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePlayer, PlayableItem } from '@/context/PlaybackContext';
import { useFavorites } from '@/context/FavoritesContext';
import { toast } from 'react-toastify';
import { HeaderSkeleton } from '@/components/skeletons/tracks/HeaderSkeleton';
import { TrackSkeletonRow } from '@/components/skeletons/tracks/TrackSkeletonRow';
import { TruncatedText } from '@/components/ui/TruncatedText';
import { TruncatedLink } from '@/components/ui/TruncatedLink';

interface TrackWithPlaylist extends PlayableItem {
  playlistId?: number | string | null;
  playlistName?: string | null;
  isFavorite?: boolean;
}

const GRID_CLASSES = 'grid-cols-[2rem_1fr_2.5rem] sm:grid-cols-[2rem_1fr_2.5rem_5rem] md:grid-cols-[2rem_1fr_9rem_2.5rem_5rem]';

export default function TracksPage() {

  useEffect(() => {
    document.title = 'Canciones';
  }, []);

  const [tracks, setTracks] = useState<TrackWithPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const { toggleFavorite, isFavorite, syncFavorites } = useFavorites();

  useEffect(() => {
    fetch('/api/tracks')
      .then(r => r.json())
      .then(data => {
        setTracks(data);
        syncFavorites(data);
      })
      .catch(err => {
        console.error('Error cargando tracks:', err);
        toast.error('Error cargando tracks');
      })
      .finally(() => setLoading(false));
  }, [syncFavorites]);

  const filteredTracks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return tracks;
    return tracks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.artist && t.artist.toLowerCase().includes(q))
    );
  }, [tracks, searchQuery]);

  const totalSeconds = useMemo(() =>
    tracks.reduce((acc, t) => {
      if (!t.durationString) return acc;
      const parts = t.durationString.split(':').map(Number);
      if (parts.length === 3) return acc + parts[0] * 3600 + parts[1] * 60 + parts[2];
      if (parts.length === 2) return acc + parts[0] * 60 + (parts[1] || 0);
      return acc;
    }, 0),
    [tracks]
  );
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMins = Math.floor((totalSeconds % 3600) / 60);

  const accentOutlineStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1.5px solid var(--accent, #6ee29e)',
    color: 'var(--accent, #6ee29e)',
  };

  const playlistIcon = (
    <svg
      className="w-4 h-4 shrink-0"
      viewBox="0 0 24 24"
      fill="var(--accent, #6ee29e)"
      stroke="var(--accent, #6ee29e)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        filter: 'drop-shadow(0 0 6px rgba(110,226,158,0.2))'
      }}
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );

  return (
    <div className="px-4 sm:px-6 md:px-8 pt-8 md:pt-12 pb-8">

      {loading ? <HeaderSkeleton /> : (
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
          <div className="flex items-end gap-4 sm:gap-5 min-w-0">
            <div
              className="w-16 h-16 sm:w-[88px] sm:h-[88px] rounded-2xl flex items-center justify-center shrink-0 select-none"
              style={{
                background: 'var(--bg-card, #1e1e1e)',
                border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
              }}
            >
              <svg
                width="36"
                height="36"
                className="sm:w-12 sm:h-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent, #6ee29e)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div className="pb-1 space-y-1 min-w-0">
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--accent, #6ee29e)' }}>
                Biblioteca Local
              </p>
              <h1 className="text-2xl sm:text-[28px] font-bold leading-tight truncate" style={{ color: 'var(--text-primary, #fff)' }}>
                Todas las canciones
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.45))' }}>
                <span style={{ color: 'var(--text-primary, #fff)' }}>{tracks.length} canciones</span>
                {totalSeconds > 0 && (
                  <span style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}> · {totalHours}h {totalMins}m</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pb-1 w-full lg:w-auto">

            <div className="relative flex-1 min-w-[180px] sm:flex-none">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 select-none pointer-events-none flex items-center justify-center"
                style={{ lineHeight: 1 }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent, #6ee29e)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(110,226,158,0.2))'
                  }}
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Buscar canción o artista…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-11 pl-10 pr-9 w-full sm:w-64 rounded-xl text-[15px] outline-none transition"
                style={{
                  background: 'var(--bg-card, rgba(255,255,255,0.05))',
                  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  color: 'var(--text-primary, #fff)',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm transition"
                  style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary, #fff)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted, rgba(255,255,255,0.3))'}
                >
                  ✕
                </button>
              )}
            </div>

            <Link
              href="/playlists"
              className="h-11 px-5 flex items-center gap-2 rounded-xl text-sm font-semibold transition shrink-0"
              style={accentOutlineStyle}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(110,226,158,0.08)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <svg
                className="w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="var(--accent, #6ee29e)"
                stroke="var(--accent, #6ee29e)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(110,226,158,0.2))'
                }}
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              Ver Playlists
            </Link>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.1))' }}>
          <div
            className="flex items-center gap-4 px-4 sm:px-6 py-3"
            style={{
              borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {['w-5', 'flex-1', 'w-20 hidden md:block', 'w-6', 'w-12'].map((cls, i) => (
              <div key={i} className={`h-2.5 rounded animate-pulse ${cls}`} style={{ background: 'rgba(255,255,255,0.08)' }} />
            ))}
          </div>
          {Array.from({ length: 14 }).map((_, i) => <TrackSkeletonRow key={i} index={i} />)}
        </div>
      ) : tracks.length === 0 ? (
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>No hay canciones indexadas</p>
          <p className="text-xs" style={{ color: 'var(--text-muted, rgba(255,255,255,0.2))' }}>Ve a Ajustes e iniciá el escáner.</p>
        </div>
      ) : filteredTracks.length === 0 ? (
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            Sin resultados para "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.1))' }}>

          <div
            className={`grid ${GRID_CLASSES} items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3`}
            style={{
              borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <span
              className="text-[15px] font-medium text-center select-none"
              style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}
            >
              #
            </span>
            <span
              className="text-[15px] font-medium"
              style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}
            >
              Título
            </span>
            <span
              className="text-[15px] font-medium hidden md:block text-center w-full"
              style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}
            >
              Playlist
            </span>
            <span
              className="text-xl flex items-center justify-center"
              style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}
            >
              ♥
            </span>
            <span
              className="text-[15px] font-medium text-center hidden sm:block"
              style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}
            >
              Duración
            </span>
          </div>

          {filteredTracks.map((track, index) => {
            const isCurrent = currentTrack?.id === track.id;
            const trackIsFavorite = isFavorite(track.id);

            return (
              <div
                key={track.id}
                className={`grid ${GRID_CLASSES} items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 transition-colors duration-200 
        ${isCurrent
                    ? ''
                    : 'group hover:bg-[var(--row-hover-bg)]'
                  }`}
                style={{
                  borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.04))',
                }}
              >
                <div className="relative w-8 h-8 flex items-center justify-center mx-auto shrink-0">
                  <span
                    className={`text-sm tabular-nums transition-opacity select-none ${isCurrent ? 'opacity-0' : 'group-hover:opacity-0'}`}
                    style={{ color: isCurrent ? 'var(--accent, #6ee29e)' : 'var(--text-muted, rgba(255,255,255,0.3))' }}
                  >
                    {index + 1}
                  </span>

                  <button
                    onClick={() => isCurrent ? togglePlay() : playTrack(track, filteredTracks)}
                    className={`absolute inset-0 flex items-center justify-center rounded-full transition-all 
                     ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                     bg-[rgba(110,226,158,0.1)] border border-[var(--accent)] text-[var(--accent)]
                     hover:bg-[var(--accent)] hover:text-black hover:scale-105`}
                    aria-label={isCurrent && isPlaying ? 'Pausar' : 'Reproducir'}
                  >
                    <span
                      className="relative flex items-center justify-center"
                      style={{
                        left: isCurrent && isPlaying ? '0.3px' : '1.7px',
                        bottom: '0.5px',
                        fontSize: isCurrent && isPlaying ? '20px' : '12px'
                      }}
                    >
                      {isCurrent && isPlaying ? '⏸' : '▶'}
                    </span>
                  </button>
                </div>

                <div className="min-w-0">
                  <TruncatedText
                    text={track.title}
                    className="text-[15px] font-medium leading-snug"
                  />
                  <p className="text-sm truncate mt-0.5" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.4))' }}>
                    {track.artist || 'Unknown Artist'}
                    <span className="sm:hidden">
                      {' · '}{track.durationString || '—'}
                    </span>
                  </p>
                  {track.playlistName ? (
                    <div className="md:hidden mt-1.5">
                      <TruncatedLink
                        text={track.playlistName}
                        href={`/playlists/${track.playlistId}`}
                        style={accentOutlineStyle}
                        onClick={e => e.stopPropagation()}
                        icon={playlistIcon}
                      />
                    </div>
                  ) : (
                    <span className="md:hidden text-xs italic opacity-30 block mt-1">Sin playlist</span>
                  )}
                </div>

                <div className="hidden md:flex justify-center min-w-0 overflow-hidden">
                  {track.playlistName ? (
                    <TruncatedLink
                      text={track.playlistName}
                      href={`/playlists/${track.playlistId}`}
                      style={accentOutlineStyle}
                      onClick={e => e.stopPropagation()}
                      icon={playlistIcon}
                    />
                  ) : (
                    <span className="text-sm italic opacity-30 truncate block w-full text-center">Sin playlist</span>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={() => toggleFavorite(track.id, trackIsFavorite)}
                    className={`text-xl transition-all active:scale-75 ${trackIsFavorite ? 'opacity-100' : 'opacity-20 hover:opacity-60'}`}
                    style={{ filter: trackIsFavorite ? 'drop-shadow(0 0 4px rgba(239,68,68,0.4))' : undefined }}
                  >
                    {trackIsFavorite ? '❤️' : '🤍'}
                  </button>
                </div>

                <p className="hidden sm:block text-sm tabular-nums text-center font-medium opacity-50">
                  {track.durationString || '—'}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredTracks.length > 0 && searchQuery && (
        <p className="mt-4 text-sm text-center" style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}>
          {filteredTracks.length} resultado{filteredTracks.length !== 1 ? 's' : ''} para "{searchQuery}"
        </p>
      )}
    </div>
  );
}