'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePlayer, PlayableItem } from '@/context/PlaybackContext';
import { useFavorites } from '@/context/FavoritesContext';
import { toast } from 'react-toastify';
import { HeaderSkeleton } from '@/components/skeletons/favorites/HeaderSkeleton';
import { TrackSkeletonRow } from '@/components/skeletons/favorites/TrackSkeletonRow';
import { TruncatedText } from '@/components/ui/TruncatedText';
import { TruncatedLink } from '@/components/ui/TruncatedLink';
import { getPlaylistDurationStr } from '@/lib/duration';

interface FavoriteTrack extends PlayableItem {
  playlistId?: number | string | null;
  playlistName?: string | null;
  isFavorite?: boolean;
}

const GRID_CLASSES = 'grid-cols-[2rem_1fr_2rem] sm:grid-cols-[2rem_1fr_2rem_5rem] md:grid-cols-[2rem_1fr_8rem_2rem_5rem]';

export default function FavoritesPage() {

  useEffect(() => {
    document.title = 'Favoritas';
  }, []);

  const [favoriteTracks, setFavoriteTracks] = useState<FavoriteTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { playTrack, currentTrack, isPlaying, togglePlay, updateQueue, queue } = usePlayer();
  const { toggleFavorite, isFavorite, syncFavorites } = useFavorites();

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/tracks?favorites=true');
      if (res.ok) {
        const data = await res.json();
        setFavoriteTracks(data);
        syncFavorites(data);
      }
    } catch (err) {
      console.error("Error leyendo tus favoritos desde Drizzle:", err);
      toast.error("Error leyendo tus favoritos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFromFavorites = async (id: string | number) => {
    const originalTracks = [...favoriteTracks];
    const newTracks = favoriteTracks.filter(t => t.id !== id);
    setFavoriteTracks(newTracks);
    
    if (currentTrack?.id === id) {
      const currentIndex = queue.findIndex(t => t.id === id);
      if (currentIndex !== -1) {
        const newQueue = [...queue];
        newQueue.splice(currentIndex, 1);
        updateQueue(newQueue);
        if (newQueue.length > 0) {
          playTrack(newQueue[0], newQueue);
        }
      }
    } else {
      const newQueue = queue.filter(t => t.id !== id);
      updateQueue(newQueue);
    }
    
    try {
      await toggleFavorite(id, true);
    } catch (err) {
      console.error("Error al actualizar estado :", err);
      setFavoriteTracks(originalTracks);
      updateQueue(queue);
    }
  };

  const filteredTracks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return favoriteTracks;
    return favoriteTracks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.artist && t.artist.toLowerCase().includes(q)) ||
      (t.playlistName && t.playlistName.toLowerCase().includes(q))
    );
  }, [favoriteTracks, searchQuery]);

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
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">

      {loading ? <HeaderSkeleton /> : (
        <>
          <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            <Link
              href="/tracks"
              className="transition hover:opacity-100 opacity-60"
              style={{ color: 'var(--text-secondary, rgba(255,255,255,0.5))' }}
            >
              Biblioteca
            </Link>
            <span className="opacity-30">/</span>
            <span style={{ color: 'var(--text-primary, #fff)' }}>Canciones Favoritas</span>
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
                  fill="var(--accent, #6ee29e)"
                  stroke="var(--accent, #6ee29e)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="pb-1 space-y-1 min-w-0">
                <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--accent, #6ee29e)' }}>
                  Lista de reproducción
                </p>
                <h1 className="text-2xl sm:text-[28px] font-bold leading-tight truncate" style={{ color: 'var(--text-primary, #fff)' }}>
                  Canciones Favoritas
                </h1>
                {favoriteTracks && (
                  <p className="text-sm" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.45))' }}>
                    <span style={{ color: 'var(--text-primary, #fff)' }}>
                      {filteredTracks.length} canciones
                    </span>
                    {getPlaylistDurationStr(favoriteTracks) && (
                      <span style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}>
                        {' · '}{getPlaylistDurationStr(favoriteTracks)}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {favoriteTracks.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pb-1 w-full lg:w-auto">
                <button
                  onClick={() => {
                    const tracksToPlay = filteredTracks.length > 0 ? filteredTracks : favoriteTracks;
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
                    placeholder="Buscar en favoritos…"
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
            className="flex items-center gap-4 px-4 sm:px-6 py-4"
            style={{
              borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {['w-5', 'flex-1', 'w-6', 'w-6', 'w-10'].map((cls, i) => (
              <div key={i} className={`h-2.5 rounded animate-pulse ${cls}`} style={{ background: 'rgba(255,255,255,0.08)' }} />
            ))}
          </div>
          {Array.from({ length: 8 }).map((_, i) => <TrackSkeletonRow key={i} index={i} />)}
        </div>
      ) : favoriteTracks.length === 0 ? (
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
          <span className="text-4xl mb-3 block opacity-40 select-none">🖤</span>
          <p className="text-sm" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            Aún no tienes canciones favoritas
          </p>
          <p className="text-xs mt-2 max-w-md mx-auto px-4" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.4))' }}>
            Explora tus carpetas locales en la sección{' '}
            <Link href="/tracks" className="text-[var(--accent, #6ee29e)] font-semibold hover:underline">
              Todas las canciones
            </Link>{' '}
            y haz clic en el icono del corazón.
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
              borderBottom: '1px solid var(--border-color)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <span className="text-[15px] font-medium text-center" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>#</span>
            <span className="text-[15px] font-medium" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>Título</span>
            <span className="hidden md:flex text-[15px] font-medium justify-center pl-[4px]" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>Playlist</span>
            <span className="text-xl flex items-center justify-center" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>♥</span>
            <span className="hidden sm:block text-[15px] font-medium text-center" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>Duración</span>
          </div>

          {filteredTracks.map((track, index) => {
            const isCurrent = currentTrack?.id === track.id;
            const trackIsFavorite = isFavorite(track.id);

            return (
              <div
                key={`${track.id}-${index}`}
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
                        const tracksToPlay = filteredTracks.length > 0 ? filteredTracks : favoriteTracks;
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
                  {track.playlistName ? (
                    <div className="md:hidden mt-1.5">
                      <TruncatedLink
                        text={track.playlistName}
                        href={`/playlists/${track.playlistId}`}
                        style={{
                          color: 'var(--accent, #6ee29e)',
                          border: '1.5px solid var(--accent, #6ee29e)',
                          background: 'transparent',
                        }}
                        icon={playlistIcon}
                      />
                    </div>
                  ) : (
                    <span className="md:hidden text-xs italic block mt-1" style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}>
                      Canción suelta
                    </span>
                  )}
                </div>

                <div className="hidden md:flex justify-center min-w-0 overflow-hidden">
                  {track.playlistName ? (
                    <TruncatedLink
                      text={track.playlistName}
                      href={`/playlists/${track.playlistId}`}
                      style={{
                        color: 'var(--accent, #6ee29e)',
                        border: '1.5px solid var(--accent, #6ee29e)',
                        background: 'transparent',
                      }}
                      icon={playlistIcon}
                    />
                  ) : (
                    <span className="text-sm italic w-full text-center" style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}>
                      Canción suelta
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={() => removeFromFavorites(track.id)}
                    className="text-xl transition-all active:scale-75 hover:scale-110"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(239,68,68,0.4))' }}
                    aria-label="Quitar de favoritos"
                  >
                    ❤️
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