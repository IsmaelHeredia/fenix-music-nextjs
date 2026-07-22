'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePlayer, PlayableItem } from '@/context/PlaybackContext';
import { toast } from 'react-toastify';
import { PlaylistGridSkeleton } from '@/components/skeletons/playlists/PlaylistGridSkeleton';
import { TruncatedText } from '@/components/ui/TruncatedText';
import { getPlaylistDurationStr } from '@/lib/duration';

interface PlaylistGroup {
  id: number | string;
  name: string;
  totalTracks: number;
  artistSample: string;
  tracks: PlayableItem[];
}

export default function PlaylistsPage() {

  useEffect(() => {
    document.title = 'Listas';
  }, []);

  const [playlists, setPlaylists] = useState<PlaylistGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { playTrack } = usePlayer();

  useEffect(() => {
    fetch('/api/playlists')
      .then((res) => res.json())
      .then((data) => {
        setPlaylists(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al traer playlists:', err);
        toast.error('Error al traer playlists');
        setLoading(false);
      });
  }, []);

  const handlePlayPlaylistShortcut = (e: React.MouseEvent, tracks: PlayableItem[]) => {
    e.preventDefault();
    e.stopPropagation();
    if (tracks && tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const filteredPlaylists = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return playlists;
    return playlists.filter((playlist) =>
      playlist.name.toLowerCase().includes(query) ||
      (playlist.artistSample && playlist.artistSample.toLowerCase().includes(query))
    );
  }, [playlists, searchQuery]);

  return (
    <div className="px-8 py-8">

      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
        <Link
          href="/tracks"
          className="transition hover:opacity-100 opacity-60"
          style={{ color: 'var(--text-secondary, rgba(255,255,255,0.5))' }}
        >
          Biblioteca
        </Link>
        <span className="opacity-30">/</span>
        <span style={{ color: 'var(--text-primary, #fff)' }}>Playlists</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
        <div className="flex items-end gap-5">
          <div
            className="w-[88px] h-[88px] rounded-2xl flex items-center justify-center shrink-0 select-none"
            style={{
              background: 'var(--bg-card, #1e1e1e)',
              border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
            }}
          >
            <svg
              width="48"
              height="48"
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
          </div>
          <div className="pb-1 space-y-1">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--accent, #6ee29e)' }}>
              Módulos de Almacenamiento
            </p>
            <h1 className="text-[28px] font-bold leading-tight" style={{ color: 'var(--text-primary, #fff)' }}>
              Tus Colecciones
            </h1>
            {!loading && playlists.length > 0 && (
              <p className="text-sm" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.45))' }}>
                <span style={{ color: 'var(--text-primary, #fff)' }}>
                  {filteredPlaylists.length} colecciones
                </span>
                <span style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}>
                  {' · '}Estructura de carpetas mapeada
                </span>
              </p>
            )}
          </div>
        </div>

        {!loading && playlists.length > 0 && (
          <div className="relative pb-1">
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
              placeholder="Buscar carpeta ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 pl-10 pr-9 w-56 rounded-xl text-[15px] outline-none transition"
              style={{
                background: 'var(--bg-card, rgba(255,255,255,0.05))',
                border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                color: 'var(--text-primary, #fff)',
                marginTop: '3px'
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
        )}
      </div>

      {loading ? (
        <PlaylistGridSkeleton />
      ) : playlists.length === 0 ? (
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            No hay ninguna playlist mapeada
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.4))' }}>
            Mueve música dentro de tus subcarpetas locales para verlas reflejadas.
          </p>
        </div>
      ) : filteredPlaylists.length === 0 ? (
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            No se encontró la colección "{searchQuery}"
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredPlaylists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlists/${playlist.id}`}
                className="group relative flex flex-col gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] transition-all duration-200 hover:bg-white/[0.06] hover:border-white/[0.15]"
              >
                <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-[var(--bg-hover)] to-[var(--bg-base)] border flex items-center justify-center relative overflow-hidden select-none shadow-inner"
                  style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.1))' }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at top right, rgba(110, 226, 158, 0.15), transparent 70%)'
                    }}
                  />
                  <svg
                    className="w-12 h-12 group-hover:scale-110 transition-transform duration-300 relative z-10"
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

                  <button
                    onClick={(e) => handlePlayPlaylistShortcut(e, playlist.tracks)}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 z-20
             bg-[rgba(110,226,158,0.1)] border border-[var(--accent)] text-[var(--accent)]
             hover:bg-[var(--accent)] hover:text-black"
                    style={{
                      backdropFilter: 'blur(4px)',
                    }}
                    title="Reproducir lista"
                  >
                    <span className="text-xs relative" style={{ top: '-0.5px', left: '1px' }}>▶</span>
                  </button>
                </div>

                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div>
                    <TruncatedText
                      text={playlist.name}
                      className="text-sm font-bold group-hover:text-[var(--accent)] transition-colors"
                    />
                  </div>
                  <div className="mt-4 pt-2.5 border-t flex flex-col gap-1" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                      {playlist.totalTracks} {playlist.totalTracks === 1 ? 'canción' : 'canciones'}
                    </span>
                    <span className="text-xs tabular-nums font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-secondary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {getPlaylistDurationStr(playlist.tracks)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {searchQuery && (
            <p className="mt-6 text-sm text-center" style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}>
              {filteredPlaylists.length} resultado{filteredPlaylists.length !== 1 ? 's' : ''} para "{searchQuery}"
            </p>
          )}
        </>
      )}
    </div>
  );
}