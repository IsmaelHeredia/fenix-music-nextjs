'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import LiveStreamModal from '@/components/modals/LiveStreamModal';
import dynamic from 'next/dynamic';

import { toast } from 'react-toastify';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { TruncatedText } from '@/components/ui/TruncatedText';
import { usePlayer } from '@/context/PlaybackContext';
import { useRadioPlayer } from '@/context/RadioPlayerContext';
import { useMediaTitle } from '@/context/TabTitleContext';

const Plyr = dynamic(() => import('plyr-react').then((m) => m.Plyr).catch((err) => {
  console.error('Error loading Plyr:', err);
  return () => null;
}), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <span className="text-white opacity-40 text-sm">Cargando reproductor...</span>
    </div>
  ),
});

import 'plyr-react/plyr.css';
import { LiveStreamGridSkeleton } from '@/components/skeletons/livestreams/LiveStreamGridSkeleton';

function StreamPlayer({ stream, onPlayingChange }: { stream: any; onPlayingChange: (playing: boolean) => void }) {
  const [isMounted, setIsMounted] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const plyrRef = useRef<any>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/|\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(stream.link);
  const isYouTubeVideo = videoId !== null;

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
      if (plyrRef.current?.plyr) {
        try {
          plyrRef.current.plyr.destroy();
        } catch (e) {
        }
      }
    };
  }, []);

  useEffect(() => {
    if (isMounted && plyrRef.current?.plyr) {
      const player = plyrRef.current.plyr;

      const handleError = (event: any) => {
        console.error('Plyr error:', event);
        setPlayerError('Error en el reproductor');
      };

      const videoElement = player.media;
      if (videoElement) {
        videoElement.loop = true;
      }

      player.on('error', handleError);

      return () => {
        player.off('error', handleError);
      };
    }
  }, [isMounted]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!isMounted || !el) return;

    const onStart = () => onPlayingChange(true);
    const onStop = () => onPlayingChange(false);

    el.addEventListener('playing', onStart, true);
    el.addEventListener('play', onStart, true);
    el.addEventListener('pause', onStop, true);
    el.addEventListener('ended', onStop, true);

    return () => {
      el.removeEventListener('playing', onStart, true);
      el.removeEventListener('play', onStart, true);
      el.removeEventListener('pause', onStop, true);
      el.removeEventListener('ended', onStop, true);
      onPlayingChange(false);
    };
  }, [isMounted, playerError, onPlayingChange]);

  if (!videoId && !stream.link) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2 text-2xl">❌</p>
          <p className="text-white opacity-60 text-sm">URL de video inválida</p>
        </div>
      </div>
    );
  }

  if (playerError) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2 text-2xl">⚠️</p>
          <p className="text-white opacity-60 text-sm">Error al cargar el reproductor</p>
          <button
            onClick={() => setPlayerError(null)}
            className="mt-4 px-4 py-2 text-xs bg-white/10 rounded-lg hover:bg-white/20 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const source = {
    type: 'video' as const,
    sources: [{
      src: videoId ?? stream.link,
      provider: videoId ? ('youtube' as const) : ('html5' as const)
    }],
  };

  const options = {
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
    autoplay: true,
    loop: { active: true },
    youtube: {
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
    },
  };

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <span className="text-white opacity-40 text-sm">Inicializando...</span>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="w-full h-full">
      <Plyr
        ref={plyrRef}
        source={source as any}
        options={options as any}
      />
    </div>
  );
}

export default function LiveStreamsPage() {

  useEffect(() => {
    document.title = 'Live Streams';
  }, []);

  const [streams, setStreams] = useState<any[]>([]);
  const [selectedStream, setSelectedStream] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [showActions, setShowActions] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<any | null>(null);
  const [playerKey, setPlayerKey] = useState(Date.now());
  const [isPlaying, setIsPlaying] = useState(false);
  const [streamPlaying, setStreamPlaying] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const { isPlaying: isMusicPlaying, togglePlay: pauseMusic } = usePlayer();
  const { isRadioPlaying, stopRadio } = useRadioPlayer();

  useMediaTitle('livestream', selectedStream && isPlaying && streamPlaying ? selectedStream.name : null);

  const pauseOtherMedia = () => {
    if (isMusicPlaying) pauseMusic();
    if (isRadioPlaying) stopRadio();
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const res = await fetch('/api/livestreams');
      if (res.ok) setStreams(await res.json());
    } catch (err) {
      console.error('Error cargando streams:', err);
      toast.error('Error al cargar las transmisiones');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      const method = editingStream ? 'PUT' : 'POST';
      const res = await fetch('/api/livestreams', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, id: editingStream?.id }),
      });
      if (!res.ok) { toast.error('Error al guardar la transmisión'); return; }
      toast.success(editingStream ? 'Transmisión actualizada' : 'Transmisión creada');
      fetchStreams();
      setIsModalOpen(false);
      setEditingStream(null);
    } catch {
      toast.error('Error de red al guardar');
    }
  };

  const requestDelete = (id: number, name: string) => setDeleteTarget({ id, name });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/livestreams?id=${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Error al eliminar la transmisión'); return; }
      setStreams(prev => prev.filter(s => s.id !== deleteTarget.id));
      if (selectedStream?.id === deleteTarget.id) {
        setSelectedStream(null);
        setIsPlaying(false);
      }
      toast.info('Transmisión eliminada');
    } catch {
      toast.error('Error de red al eliminar');
    } finally {
      setDeleteTarget(null);
    }
  };

  const categories = useMemo(() => {
    return ['Todas', ...Array.from(new Set(streams.flatMap((s) => (s.categories ? s.categories.split(',') : []))))];
  }, [streams]);

  const filteredStreams = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return streams.filter(
      (s) =>
        s.name.toLowerCase().includes(query) &&
        (activeCategory === 'Todas' || s.categories?.includes(activeCategory))
    );
  }, [streams, searchQuery, activeCategory]);

  const handleSelectStream = (stream: any) => {
    if (selectedStream?.id === stream.id && isPlaying) {
      setIsPlaying(false);
      setSelectedStream(null);
    } else {
      pauseOtherMedia();
      setSelectedStream(stream);
      setIsPlaying(true);
      setPlayerKey(Date.now());
    }
  };

  return (
    <>
      {deleteTarget && (
        <ConfirmModal
          name={deleteTarget.name}
          itemLabel="transmisión"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">

        <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
          <Link
            href="/tracks"
            className="transition hover:opacity-100 opacity-60"
            style={{ color: 'var(--text-secondary, rgba(255,255,255,0.5))' }}
          >
            Biblioteca
          </Link>
          <span className="opacity-30">/</span>
          <span style={{ color: 'var(--text-primary, #fff)' }}>Live Streams</span>
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
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(110,226,158,0.2))'
                }}
              >
                <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                <circle cx="12" cy="12" r="2" fill="var(--accent, #6ee29e)" />
                <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                <path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2" />
                <rect x="11" y="14" width="2" height="4" fill="var(--accent, #6ee29e)" stroke="none" />
              </svg>
            </div>
            <div className="pb-1 space-y-1 min-w-0">
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--accent, #6ee29e)' }}>
                Live Broadcast
              </p>
              <h1 className="text-2xl sm:text-[28px] font-bold leading-tight truncate" style={{ color: 'var(--text-primary, #fff)' }}>
                Live Center
              </h1>
              {!loading && streams.length > 0 && (
                <p className="text-sm" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.45))' }}>
                  <span style={{ color: 'var(--text-primary, #fff)' }}>
                    {filteredStreams.length} transmisiones
                  </span>
                  <span style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}>
                    {' · '}En vivo ahora
                  </span>
                </p>
              )}
            </div>
          </div>

          {!loading && streams.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pb-1 w-full lg:w-auto">
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
                  placeholder="Buscar transmisión..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

              <div className="relative shrink-0">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="h-11 px-4 flex items-center gap-2 rounded-xl text-sm font-semibold transition"
                  style={{
                    background: 'var(--bg-card, rgba(255,255,255,0.05))',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                    color: 'var(--text-primary, #fff)',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-card, rgba(255,255,255,0.05))'}
                >
                  Acciones ▾
                </button>
                {showActions && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl overflow-hidden z-50"
                    style={{
                      background: 'var(--bg-card, #1e1e1e)',
                      border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                    }}
                  >
                    <button
                      onClick={() => { setIsModalOpen(true); setShowActions(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm transition hover:bg-white/5 flex items-center gap-2"
                      style={{ color: 'var(--text-primary, #fff)' }}
                    >
                      <svg
                        className="w-4 h-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--accent, #6ee29e)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                      Nueva transmisión
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative group mb-8">
          <div
            className="absolute -inset-1 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-700"
            style={{
              background: `linear-gradient(135deg, var(--accent, #6ee29e) 0%, #6366f1 100%)`,
            }}
          />
          <div
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'var(--bg-card, #1e1e1e)',
              border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
            }}
          >
            {selectedStream && isPlaying ? (
              <StreamPlayer
                key={`player-${selectedStream.id}-${playerKey}`}
                stream={selectedStream}
                onPlayingChange={setStreamPlaying}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <span className="text-6xl mb-4 animate-pulse opacity-40">📡</span>
                <p className="font-medium opacity-40 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {selectedStream && !isPlaying ? 'Detenido' : 'Selecciona una señal para conectar'}
                </p>
              </div>
            )}
          </div>
        </div>

        {!loading && streams.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={{
                    background: isActive ? 'var(--accent, #6ee29e)' : 'var(--bg-card, rgba(255,255,255,0.05))',
                    border: isActive ? 'none' : '1px solid var(--border-color, rgba(255,255,255,0.1))',
                    color: isActive ? '#000' : 'var(--text-secondary, rgba(255,255,255,0.5))',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <LiveStreamGridSkeleton />
        ) : streams.length === 0 ? (
          <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
            <span className="text-4xl mb-3 block opacity-40 select-none">🌐</span>
            <p className="text-sm" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
              No hay transmisiones configuradas
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold transition"
              style={{
                background: 'transparent',
                border: '1.5px solid var(--accent, #6ee29e)',
                color: 'var(--accent, #6ee29e)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(110,226,158,0.08)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              ➕ Agregar tu primera transmisión
            </button>
          </div>
        ) : filteredStreams.length === 0 ? (
          <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
              No se encontraron transmisiones para "{searchQuery}"
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredStreams.map((stream) => {
                const isSelected = selectedStream?.id === stream.id && isPlaying;
                const isActive = isSelected;

                return (
                  <div
                    key={stream.id}
                    className="group relative rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden border bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--accent)]/50"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(110,226,158,0.1),transparent_70%)]" />

                    <div className="absolute top-4 right-4 z-20">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === Number(stream.id) ? null : Number(stream.id)); }}
                        className="w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center text-sm font-bold hover:bg-white/10 backdrop-blur-sm text-[var(--text-muted)]"
                      >
                        ⋮
                      </button>
                      {openMenuId === Number(stream.id) && (
                        <div className="absolute right-0 mt-1 w-28 rounded-lg overflow-hidden z-30 animate-fadeIn bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingStream(stream); setIsModalOpen(true); setOpenMenuId(null); }}
                            className="w-full text-left px-3 py-2 text-xs transition hover:bg-white/5 flex items-center gap-2"
                            style={{ color: 'var(--text-primary, #fff)' }}
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--accent, #6ee29e)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); requestDelete(Number(stream.id), stream.name); setOpenMenuId(null); }}
                            className="w-full text-left px-3 py-2 text-xs transition hover:bg-white/5 flex items-center gap-2 text-red-400"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-6 relative z-10 flex flex-col items-center justify-center min-h-[220px]">

                      <div
                        onClick={(e) => { e.stopPropagation(); handleSelectStream(stream); }}
                        className={`mb-5 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${isActive
                          ? 'bg-[var(--accent)] text-black scale-100 opacity-100 shadow-lg shadow-[var(--accent)]/30'
                          : 'bg-transparent border-2 border-[var(--accent)] text-[var(--accent)] scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                          }`}
                      >
                        {isActive ? (
                          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        ) : (
                          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </div>

                      <TruncatedText
                        text={stream.name}
                        as="h3"
                        className="font-bold text-xl text-center w-full transition-colors text-[var(--text-primary)] group-hover:text-[var(--accent)]"
                      />

                      {isActive && (
                        <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent)]/20 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                          <span className="text-[10px] font-semibold text-[var(--accent)]">ON AIR</span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 justify-center mt-3">
                        {stream.categories?.split(',').map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 cursor-default"
                            style={{
                              background: 'transparent',
                              border: '1.5px solid var(--accent, #6ee29e)',
                              color: 'var(--accent, #6ee29e)',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'rgba(110,226,158,0.08)';
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {searchQuery && (
              <p className="mt-6 text-sm text-center" style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}>
                {filteredStreams.length} resultado{filteredStreams.length !== 1 ? 's' : ''} para "{searchQuery}"
              </p>
            )}
          </>
        )}

        <LiveStreamModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStream(null);
          }}
          onSave={handleSave}
          initialData={editingStream}
        />
      </div>
    </>
  );
}