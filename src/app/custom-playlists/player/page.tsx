'use client';

import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePlayer, PlayableItem } from '@/context/PlaybackContext';
import { useFavorites } from '@/context/FavoritesContext';
import { parseDurationString, formatDuration } from '../playlist.helpers';
import { PlayerPageSkeleton } from '@/components/skeletons/custom-playlists/CustomPlaylistSkeletons';
import { TruncatedText } from '@/components/ui/TruncatedText';
import { TruncatedLink } from '@/components/ui/TruncatedLink';
import { getPlaylistDurationStr } from '@/lib/duration';

interface PlaylistDetail {
  id: number;
  name: string;
  items: {
    songId: number;
    order?: number;
    durationString: string | null;
    title?: string;
    playlistName?: string;
  }[];
}

interface TrackRow extends PlayableItem {
  playlistName?: string;
  playlistId?: number | null;
  order: number;
}

const GRID_CLASSES = 'grid-cols-[2rem_1fr] sm:grid-cols-[2rem_1fr_5rem] md:grid-cols-[2rem_1fr_10rem_5rem]';

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

function CustomPlaylistPlayerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const { toggleFavorite, isFavorite, syncFavorites } = useFavorites();

  const [detail, setDetail] = useState<PlaylistDetail | null>(null);
  const [tracks, setTracks] = useState<TrackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Listas personalizadas';
  }, []);

  const loadPlaylist = useCallback(async () => {
    if (!id) { setNotFound(true); setLoading(false); return; }

    try {
      const [detailRes, songsRes, playlistsRes] = await Promise.all([
        fetch(`/api/custom-playlists?id=${id}`).then(r => r.ok ? r.json() : null),
        fetch('/api/tracks').then(r => r.json()),
        fetch('/api/playlists').then(r => r.json()),
      ]);

      if (!detailRes) { setNotFound(true); setLoading(false); return; }

      setDetail(detailRes);

      const rows: TrackRow[] = detailRes.items
        .map((item: any, idx: number) => {
          const song = songsRes.find((s: any) => s.id === item.songId);
          if (!song) return null;
          const originPlaylist = playlistsRes.find((p: any) => p.id === song.playlistId);
          return {
            ...song,
            durationString: item.durationString ?? song.durationString ?? null,
            playlistName: originPlaylist?.name ?? '',
            playlistId: song.playlistId,
            order: item.order ?? idx,
          } as TrackRow;
        })
        .filter(Boolean)
        .sort((a: TrackRow, b: TrackRow) => a.order - b.order);

      setTracks(rows);
      syncFavorites(rows);
    } catch (err) {
      console.error('[CustomPlaylistPlayer] error:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id, syncFavorites]);

  useEffect(() => { loadPlaylist(); }, [loadPlaylist]);

  const filteredTracks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return tracks;
    return tracks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.artist && t.artist.toLowerCase().includes(q)) ||
      (t.playlistName && t.playlistName.toLowerCase().includes(q))
    );
  }, [tracks, searchQuery]);

  const accentOutlineStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1.5px solid var(--accent, #6ee29e)',
    color: 'var(--accent, #6ee29e)',
  };

  if (loading) {
    return <PlayerPageSkeleton />;
  }

  if (notFound || !detail) {
    return (
      <div className="px-4 sm:px-6 md:px-8 py-8 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <span className="text-4xl opacity-40 select-none">🎵</span>
        <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>Lista no encontrada</p>
        <Link
          href="/playlists"
          className="text-sm transition hover:opacity-80"
          style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}
        >
          ← Volver a Mis listas
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">
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
        <Link
          href={`/custom-playlists`}
          className="transition hover:opacity-100 opacity-60"
          style={{ color: 'var(--text-secondary, rgba(255,255,255,0.5))' }}
        >
          Personalizadas
        </Link>
        <span className="opacity-30">/</span>
        <span className="truncate" style={{ color: 'var(--text-primary, #fff)' }}>{detail.name}</span>
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

          <div className="pb-1 space-y-1 sm:h-[88px] flex flex-col justify-center min-w-0">
            <p
              className="text-xs uppercase tracking-widest font-semibold"
              style={{
                color: 'var(--accent, #6ee29e)'
              }}
            >
              Lista personalizada
            </p>

            <h1
              className="text-2xl sm:text-[28px] font-bold leading-tight truncate"
              style={{
                color: 'var(--text-primary, #fff)'
              }}
            >
              {detail.name}
            </h1>

            {tracks?.length > 0 && (
              <p
                className="text-sm"
                style={{
                  color: 'var(--text-secondary, rgba(255,255,255,0.45))'
                }}
              >
                <span
                  style={{
                    color: 'var(--text-primary, #fff)'
                  }}
                >
                  {filteredTracks.length} canciones
                </span>

                <span
                  style={{
                    color: 'var(--text-muted, rgba(255,255,255,0.25))'
                  }}
                >
                  {' · '}
                  {getPlaylistDurationStr(tracks)}
                </span>
              </p>
            )}
          </div>
        </div>

        {tracks.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pb-1 w-full lg:w-auto">
            <button
              onClick={() => playTrack(filteredTracks[0], filteredTracks)}
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

      {tracks.length === 0 ? (
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            Esta lista no tiene canciones
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
            <span className="hidden md:flex text-[15px] font-medium justify-center" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>Playlist</span>
            <span className="hidden sm:block text-[15px] font-medium text-center" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>Duración</span>
          </div>

          {filteredTracks.map((track, index) => {
            const isCurrent = currentTrack?.id === track.id;

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
                          background: 'transparent',
                          border: '1.5px solid var(--accent, #6ee29e)',
                          color: 'var(--accent, #6ee29e)',
                        }}
                        onClick={e => e.stopPropagation()}
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
                        background: 'transparent',
                        border: '1.5px solid var(--accent, #6ee29e)',
                        color: 'var(--accent, #6ee29e)',
                      }}
                      onClick={e => e.stopPropagation()}
                      icon={playlistIcon}
                    />
                  ) : (
                    <span className="text-sm italic" style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}>
                      Canción suelta
                    </span>
                  )}
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

export default function CustomPlaylistPlayerPage() {
  return (
    <Suspense fallback={<PlayerPageSkeleton />}>
      <CustomPlaylistPlayerContent />
    </Suspense>
  );
}