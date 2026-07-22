'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePlayer, PlayableItem } from '@/context/PlaybackContext';
import { DashboardSkeleton } from '@/components/skeletons/dashboard/DashboardSkeleton';
import { toast } from 'react-toastify';
import { TruncatedText } from '@/components/ui/TruncatedText';
import { TruncatedLink } from '@/components/ui/TruncatedLink';

interface DashboardTrack extends PlayableItem {
  playlistId?: number | string | null;
  playlistName?: string | null;
}

interface TopPlaylist {
  name: string;
  count: number;
  duration: string;
  size: string;
  color: string;
}

interface DashStats {
  totalSongs: number;
  totalStations: number;
  totalLivestreams: number;
  totalVideos: number;
  totalCustomPlaylists: number;
  totalSize: string;
  topPlaylists: TopPlaylist[];
  recent: DashboardTrack[];
}

export default function DashboardPage() {

  useEffect(() => {
    document.title = 'Fenix Music';
  }, []);

  const { currentTrack, isPlaying } = usePlayer();
  const [stats, setStats] = useState<DashStats>({
    totalSongs: 0,
    totalStations: 0,
    totalLivestreams: 0,
    totalVideos: 0,
    totalCustomPlaylists: 0,
    totalSize: '0 B',
    topPlaylists: [],
    recent: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error cargando estadísticas reales del dashboard:", err);
        toast.error("Error cargando estadísticas del dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

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
    <div className="w-full px-4 sm:px-6 pt-8 sm:pt-10 md:pt-12 pb-6 space-y-6 overflow-x-hidden">

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <header className="animate-fadeIn">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Hola de nuevo
            </h1>
            <p className="text-sm mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Resumen de tu almacenamiento local de medios
            </p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 animate-fadeIn">
            <div
              className="fenix-card p-3 sm:p-4 rounded-2xl border fenix-border relative overflow-hidden group"
              style={{ background: 'var(--bg-surface)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(110,226,158,0.08),transparent_70%)]" />
              <div className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0"
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
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] opacity-80 truncate">Canciones</span>
              </div>
              <div className="relative z-10 mt-1">
                <p className="text-xl sm:text-2xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{stats.totalSongs}</p>
                <p className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)' }}>{stats.totalSize}</p>
              </div>
            </div>

            <div
              className="fenix-card p-3 sm:p-4 rounded-2xl border fenix-border relative overflow-hidden group"
              style={{ background: 'var(--bg-surface)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(110,226,158,0.08),transparent_70%)]" />
              <div className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent, #6ee29e)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                  <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                  <path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] opacity-80 truncate">Radios</span>
              </div>
              <div className="relative z-10 mt-1">
                <p className="text-xl sm:text-2xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{stats.totalStations}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Online</p>
              </div>
            </div>

            <div
              className="fenix-card p-3 sm:p-4 rounded-2xl border fenix-border relative overflow-hidden group"
              style={{ background: 'var(--bg-surface)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(110,226,158,0.08),transparent_70%)]" />
              <div className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent, #6ee29e)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                  <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                  <circle cx="12" cy="12" r="2" fill="var(--accent, #6ee29e)" />
                  <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                  <path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2" />
                  <rect x="11" y="14" width="2" height="4" fill="var(--accent, #6ee29e)" stroke="none" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] opacity-80 truncate">Live</span>
              </div>
              <div className="relative z-10 mt-1">
                <p className="text-xl sm:text-2xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{stats.totalLivestreams}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Streams</p>
              </div>
            </div>

            <div
              className="fenix-card p-3 sm:p-4 rounded-2xl border fenix-border relative overflow-hidden group"
              style={{ background: 'var(--bg-surface)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(110,226,158,0.08),transparent_70%)]" />
              <div className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent, #6ee29e)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] opacity-80 truncate">Videos</span>
              </div>
              <div className="relative z-10 mt-1">
                <p className="text-xl sm:text-2xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{stats.totalVideos}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Locales</p>
              </div>
            </div>

            <div
              className="fenix-card p-3 sm:p-4 rounded-2xl border fenix-border relative overflow-hidden group col-span-2 md:col-span-1"
              style={{ background: 'var(--bg-surface)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(110,226,158,0.08),transparent_70%)]" />
              <div className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent, #6ee29e)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] opacity-80 truncate">Listas</span>
              </div>
              <div className="relative z-10 mt-1">
                <p className="text-xl sm:text-2xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{stats.totalCustomPlaylists}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Personalizadas</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fadeIn">

            <div className="fenix-card p-4 sm:p-5 rounded-2xl border fenix-border" style={{ background: 'var(--bg-surface)' }}>
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent, #6ee29e)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Top Playlists</h3>
              </div>
              <div className="space-y-3">
                {stats.topPlaylists.length === 0 ? (
                  <p className="text-sm italic font-medium" style={{ color: 'var(--text-secondary)' }}>Sin datos</p>
                ) : (
                  stats.topPlaylists.map((pl, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: pl.color }} />
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }} title={pl.name}>
                          {pl.name}
                        </p>
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          <span>{pl.count} canciones</span>
                          <span className="hidden sm:inline">·</span>
                          <span>{pl.duration}</span>
                          <span className="hidden sm:inline">·</span>
                          <span>{pl.size}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="fenix-card p-4 sm:p-5 rounded-2xl border fenix-border" style={{ background: 'var(--bg-surface)' }}>
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent, #6ee29e)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Añadido recientemente</h3>
              </div>
              {stats.recent.length === 0 ? (
                <p className="text-sm italic font-medium" style={{ color: 'var(--text-secondary)' }}>No hay canciones recientes</p>
              ) : (
                <div className="space-y-3">
                  {stats.recent.map((track) => {
                    const isCurrent = currentTrack?.id === track.id;
                    return (
                      <div
                        key={track.id}
                        className="flex items-center flex-wrap sm:flex-nowrap gap-x-3 gap-y-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="flex-1 min-w-0 overflow-hidden basis-full sm:basis-0">
                          <TruncatedText
                            text={track.title}
                            className={`text-sm font-semibold ${isCurrent ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}
                          />
                          <p
                            className="text-xs truncate font-medium mt-0.5 pb-0.5 leading-normal"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {track.artist || 'Artista Desconocido'}
                          </p>
                        </div>
                        {track.playlistName && (
                          <div className="shrink-0 max-w-full">
                            <TruncatedLink
                              text={track.playlistName}
                              href={`/playlists/${track.playlistId}`}
                              style={{
                                background: 'transparent',
                                border: '1.5px solid var(--accent)',
                                color: 'var(--accent)',
                              }}
                              onClick={e => e.stopPropagation()}
                              icon={playlistIcon}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}