'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePlayer, PlayableItem } from '@/context/PlaybackContext';
import { useFavorites } from '@/context/FavoritesContext';
import { toast } from 'react-toastify';
import { HeaderSkeleton } from '@/components/skeletons/playlists/HeaderSkeleton';
import { TrackSkeletonRow } from '@/components/skeletons/playlists/TrackSkeletonRow';
import { TruncatedText } from '@/components/ui/TruncatedText';
import { getPlaylistDurationStr } from '@/lib/duration';

interface TrackWithPlaylist extends PlayableItem {
  isFavorite?: boolean;
}

interface PlaylistDetails {
  name: string;
  tracks: TrackWithPlaylist[];
}

interface PageProps {
  params: { id: string };
}

const GRID_CLASSES = 'grid-cols-[2rem_1fr_2.5rem] sm:grid-cols-[2rem_1fr_2.5rem_5rem]';

export default function PlaylistPage({ params }: PageProps) {

  useEffect(() => {
    document.title = 'Listas';
  }, []);

  const { id } = params;
  const [playlist, setPlaylist] = useState<PlaylistDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const { toggleFavorite, isFavorite, syncFavorites } = useFavorites();

  useEffect(() => {
    fetch(`/api/playlists/${id}`)
      .then(r => r.json())
      .then(data => {
        setPlaylist(data);
        syncFavorites(data.tracks);
      })
      .catch(err => {
        console.error('Error cargando playlist:', err);
        toast.error('Error cargando playlist');
      })
      .finally(() => setLoading(false));
  }, [id, syncFavorites]);

  const filteredTracks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return playlist?.tracks ?? [];
    return (playlist?.tracks ?? []).filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.artist && t.artist.toLowerCase().includes(q))
    );
  }, [playlist, searchQuery]);

  const accentOutlineStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1.5px solid var(--accent, #6ee29e)',
    color: 'var(--accent, #6ee29e)',
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">

      {loading ? <HeaderSkeleton /> : (
        <>
          <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            <Link
              href="/tracks"
              className="transition hover:opacity-100 opacity-60"
              style={{ color: 'var(--text-secondary, rgba(255,255,255,0.5))' }}
            >
              Biblioteca
            </Link>
            <span className="opacity-30">/</span>
            <Link
              href="/playlists"
              className="transition hover:opacity-100 opacity-60"
              style={{ color: 'var(--text-secondary, rgba(255,255,255,0.5))' }}
            >
              Playlists
            </Link>
            <span className="opacity-30">/</span>
            <span className="truncate" style={{ color: 'var(--text-primary, #fff)' }}>{playlist?.name}</span>
          </nav>

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
                  Playlist
                </p>
                <h1 className="text-2xl sm:text-[28px] font-bold leading-tight truncate" style={{ color: 'var(--text-primary, #fff)' }}>
                  {playlist?.name}
                </h1>
                {playlist && (
                  <p className="text-sm" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.45))' }}>
                    <span style={{ color: 'var(--text-primary, #fff)' }}>
                      {playlist.tracks.length} canciones
                    </span>
                    {getPlaylistDurationStr(playlist.tracks) && (
                      <span style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}>
                        {' · '}{getPlaylistDurationStr(playlist.tracks)}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {playlist && playlist.tracks.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pb-1 w-full lg:w-auto">
                <button
                  onClick={() => {
                    const tracksToPlay = filteredTracks.length > 0 ? filteredTracks : playlist.tracks;
                    playTrack(tracksToPlay[0], tracksToPlay);
                  }}
                  className="h-11 px-5 flex items-center rounded-xl text-sm font-semibold transition shrink-0"
                  style={accentOutlineStyle}
                  onMouseEnter={e =>
                    (e.currentTarget as HTMLElement).style.background = 'rgba(110,226,158,0.08)'
                  }
                  onMouseLeave={e =>
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }
                >
                  <span className="mr-2 inline-block -translate-y-px">
                    ▶
                  </span>
                  Reproducir todo
                </button>

                <div className="relative flex-1 min-w-[180px] sm:flex-none">
                  <span
                    className="absolute left-3.5 top-[50%] translate-y-[-50%] select-none pointer-events-none flex items-center justify-center"
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
                        filter: 'drop-shadow(0 0 6px rgba(110,226,158,0.2))',
                        display: 'block',
                      }}
                    >
                      <circle cx="11" cy="11" r="7" />
                      <line x1="16.5" y1="16.5" x2="21" y2="21" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar en esta lista…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="h-11 pl-10 pr-9 w-full sm:w-56 rounded-xl text-[15px] outline-none transition"
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

              </div>
            )}
          </div>
        </>
      )}

      {loading ? (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.1))' }}>
          <div
            className={`grid ${GRID_CLASSES} items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3`}
            style={{
              borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <span className="text-[15px] font-medium text-center" style={{ color: 'var(--text-muted)' }}>#</span>
            <span className="text-[15px] font-medium" style={{ color: 'var(--text-muted)' }}>Título</span>
            <span className="text-xl flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>♥</span>
            <span className="hidden sm:block text-[15px] font-medium text-center w-full" style={{ color: 'var(--text-muted)' }}>Duración</span>
          </div>
          {Array.from({ length: 12 }).map((_, i) => <TrackSkeletonRow key={i} index={i} />)}
        </div>
      ) : !playlist ? (
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            La playlist solicitada no existe.
          </p>
        </div>
      ) : playlist.tracks.length === 0 ? (
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            Esta playlist está vacía.
          </p>
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
            <span className="text-[15px] font-medium text-center" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>#</span>
            <span className="text-[15px] font-medium" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>Título</span>
            <span className="text-xl flex items-center justify-center" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>♥</span>
            <span className="hidden sm:block text-[15px] font-medium text-center w-full" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>Duración</span>
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
                    onClick={() => {
                      if (isCurrent) {
                        togglePlay();
                      } else {
                        const tracksToPlay = filteredTracks.length > 0 ? filteredTracks : playlist.tracks;
                        playTrack(track, tracksToPlay);
                      }
                    }}
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

                <div className="min-w-0 overflow-hidden">
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
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={() => toggleFavorite(track.id, trackIsFavorite)}
                    className={`text-xl transition-all active:scale-75 ${trackIsFavorite ? 'opacity-100' : 'opacity-20 hover:opacity-60'}`}
                    style={{ filter: trackIsFavorite ? 'drop-shadow(0 0 4px rgba(239,68,68,0.4))' : undefined }}
                    aria-label={trackIsFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    {trackIsFavorite ? '❤️' : '🤍'}
                  </button>
                </div>

                <p
                  className="hidden sm:block text-sm tabular-nums text-center font-medium opacity-50"
                >
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