'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { VideoGridSkeleton } from '@/components/skeletons/videos/VideoGridSkeleton';
import { TruncatedText } from '@/components/ui/TruncatedText';
import { usePlayer } from '@/context/PlaybackContext';
import { useRadioPlayer } from '@/context/RadioPlayerContext';
import { useMediaTitle } from '@/context/TabTitleContext';

interface LocalVideo {
  id: number;
  name: string;
  filename: string;
}

export default function VideosPage() {

  useEffect(() => {
    document.title = 'Videos';
  }, []);

  const [videos, setVideos] = useState<LocalVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<LocalVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { isPlaying: isMusicPlaying, togglePlay: pauseMusic } = usePlayer();
  const { isRadioPlaying, stopRadio } = useRadioPlayer();

  useMediaTitle('video', selectedVideo && isPlaying ? selectedVideo.name : null);

  const pauseOtherMedia = () => {
    if (isMusicPlaying) pauseMusic();
    if (isRadioPlaying) stopRadio();
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/videos');
        if (res.ok) {
          const data = await res.json();
          setVideos(data);
        }
      } catch (err) {
        console.error("Error leyendo catálogo de videos:", err);
        toast.error('Error leyendo catálogo de videos');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      video.currentTime = 0;
      video.play();
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [selectedVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [selectedVideo]);

  const handleSelectVideo = (video: LocalVideo) => {
    if (selectedVideo?.id === video.id) {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          pauseOtherMedia();
          videoRef.current.play();
        }
      }
    } else {
      pauseOtherMedia();
      setSelectedVideo(video);
      setIsPlaying(true);
    }
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        pauseOtherMedia();
        videoRef.current.play();
      }
    }
  };

  const filteredVideos = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return videos;
    return videos.filter(v =>
      v.name.toLowerCase().includes(query)
    );
  }, [videos, searchQuery]);

  return (
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
        <span style={{ color: 'var(--text-primary, #fff)' }}>Videos</span>
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
              style={{
                filter: 'drop-shadow(0 0 6px rgba(110,226,158,0.2))',
                display: 'block',
              }}
            >
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
              <polygon
                points="9 7 17 12 9 17 9 7"
                fill="var(--bg-card, #1e1e1e)"
                stroke="var(--accent, #6ee29e)"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <div className="pb-1 space-y-1 min-w-0">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--accent, #6ee29e)' }}>
              Reproductor Cinematográfico
            </p>
            <h1 className="text-2xl sm:text-[28px] font-bold leading-tight truncate" style={{ color: 'var(--text-primary, #fff)' }}>
              Videos Locales
            </h1>
            {!loading && videos.length > 0 && (
              <p className="text-sm" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.45))' }}>
                <span style={{ color: 'var(--text-primary, #fff)' }}>
                  {filteredVideos.length} videos
                </span>
                <span style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}>
                  {' · '}Contenido indexado
                </span>
              </p>
            )}
          </div>
        </div>

        {!loading && videos.length > 0 && (
          <div className="relative pb-1 w-full lg:w-auto">
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
              placeholder="Buscar video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 pl-10 pr-9 w-full sm:w-56 rounded-xl text-[15px] outline-none transition"
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

      <div className="relative group mb-8">
        <div
          className="absolute -inset-1 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-700"
          style={{
            background: `linear-gradient(135deg, var(--accent, #6ee29e) 0%, #6366f1 100%)`,
          }}
        />
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: '#000',
            border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
          }}
        >
          {loading ? (
            <div className="aspect-video w-full flex items-center justify-center" style={{ background: 'var(--bg-card, #1e1e1e)' }}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-[var(--accent)] animate-spin" />
                <span className="text-xs" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
                  Cargando catálogo...
                </span>
              </div>
            </div>
          ) : selectedVideo ? (
            <div className="relative aspect-video w-full flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                src={`/api/videos/stream?id=${selectedVideo.id}`}
                autoPlay
                className="w-full h-full max-h-[65vh] object-contain"
              />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                <button
                  onClick={handleTogglePlay}
                  className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 hover:bg-white/20"
                >
                  {isPlaying ? (
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="absolute top-0 left-0 right-0 p-5 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
                <h3 className="text-white font-bold text-base tracking-tight drop-shadow-md">
                  {selectedVideo.name}
                </h3>
              </div>

              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                <svg className="w-3 h-3 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 2l4 4-4 4" />
                  <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                  <path d="M7 22l-4-4 4-4" />
                  <path d="M21 13v1a4 4 0 0 1-4 4H3" />
                </svg>
                <span className="text-[10px] font-medium text-white/60">Loop</span>
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full flex flex-col items-center justify-center" style={{ background: 'var(--bg-card, #1e1e1e)' }}>
              <svg className="w-20 h-20 mb-4 opacity-40" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary, rgba(255,255,255,0.3))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                <polygon points="10 8 16 12 10 16 10 8" fill="var(--text-secondary, rgba(255,255,255,0.3))" stroke="var(--text-secondary, rgba(255,255,255,0.3))" strokeWidth="1" />
              </svg>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.5))' }}>
                Selecciona un video para comenzar
              </p>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <VideoGridSkeleton />
      ) : videos.length === 0 ? (
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
          <svg className="w-16 h-16 mx-auto mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted, rgba(255,255,255,0.3))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
            <polygon points="10 8 16 12 10 16 10 8" fill="var(--text-muted, rgba(255,255,255,0.3))" stroke="var(--text-muted, rgba(255,255,255,0.3))" strokeWidth="1" />
          </svg>
          <p className="text-sm" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            No hay videos en el catálogo
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.4))' }}>
            Agrega videos a la carpeta local para verlos reflejados
          </p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            No se encontraron videos para "{searchQuery}"
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredVideos.map((vid) => {
              const isSelected = selectedVideo?.id === vid.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => handleSelectVideo(vid)}
                  className={`group relative rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden border bg-[var(--bg-card)] ${
                    isSelected
                      ? 'border-[var(--accent)] shadow-lg shadow-[var(--accent)]/10'
                      : 'border-[var(--border-color)] hover:border-[var(--accent)]/50'
                  }`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(110,226,158,0.15),transparent_70%)]" />

                  <div className="p-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border shrink-0 ${
                        isSelected
                          ? 'border-none'
                          : 'border-[var(--border-color)] bg-white/[0.03]'
                      }`}
                      style={{
                        background: isSelected ? 'linear-gradient(135deg, var(--accent), #6366f1)' : undefined
                      }}>
                        {isSelected && isPlaying ? (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        ) : isSelected ? (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                            <polygon points="10 8 16 12 10 16 10 8" fill="#fff" stroke="#fff" strokeWidth="1" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="var(--accent, #6ee29e)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                            <polygon points="10 8 16 12 10 16 10 8" fill="var(--accent, #6ee29e)" stroke="var(--accent, #6ee29e)" strokeWidth="1" />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <TruncatedText
                          text={vid.name}
                          className={`text-sm font-semibold ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-primary)] group-hover:text-[var(--accent)]'}`}
                        />
                      </div>

                      {isSelected && (
                        <div className="shrink-0">
                          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[var(--accent)] animate-pulse' : 'bg-white/30'}`} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {searchQuery && (
            <p className="mt-6 text-sm text-center" style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}>
              {filteredVideos.length} resultado{filteredVideos.length !== 1 ? 's' : ''} para "{searchQuery}"
            </p>
          )}
        </>
      )}
    </div>
  );
}