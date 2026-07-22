'use client';

import { usePlayer } from '@/context/PlaybackContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useState, useRef, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { TruncatedText } from '@/components/ui/TruncatedText';

const IconPlay = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8 5v14l11-7z" /></svg>;
const IconPause = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>;
const IconSkipPrev = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>;
const IconSkipNext = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>;
const IconShuffle = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" /></svg>;
const IconRepeat = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" /></svg>;
const IconRepeatOne = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-4V9h-1l-2 1v1h1.5v4H13z" /></svg>;
const IconHeart = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>;
const IconHeartOutline = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>;
const IconVolume = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>;
const IconVolumeMute = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>;
const IconLoading = () => <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 animate-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>;
const IconMusic = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>;

export function PlayerBar() {
  const {
    currentTrack, isPlaying, isLoadingTrack, volume, progress,
    currentTimeStr, durationStr, isMuted, shuffle, repeat,
    togglePlay, nextTrack, prevTrack, changeVolume, changeProgress,
    toggleMute, toggleShuffle, toggleRepeat, playTrack, queue
  } = usePlayer();

  const { isFavorite, toggleFavorite } = useFavorites();
  const [favLoading, setFavLoading] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const blocked = isLoadingTrack || !currentTrack;

  const [waveformFailed, setWaveformFailed] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLoadingTimeout(false);
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }

    if (isLoadingTrack && currentTrack) {
      loadingTimerRef.current = setTimeout(() => {
        setLoadingTimeout(true);
      }, 15000);
    }

    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [isLoadingTrack, currentTrack?.id]);

  const currentWaveform = useMemo(() => {
    if (waveformFailed) return null;
    if (currentTrack && 'waveform' in currentTrack && currentTrack.waveform) {
      try {
        if (typeof currentTrack.waveform === 'string') {
          return JSON.parse(currentTrack.waveform) as number[];
        }
        if (Array.isArray(currentTrack.waveform)) {
          return currentTrack.waveform as number[];
        }
      } catch (e) {
        console.error("Error parseando waveform:", e);
        setWaveformFailed(true);
        return null;
      }
    }
    return null;
  }, [currentTrack?.id, currentTrack?.waveform, waveformFailed]);

  const displayWaveform = currentWaveform || Array.from({ length: 60 }).map(() => 12);

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (blocked || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
    changeProgress(newPercent);
  };

  const getRepeatIcon = () => {
    if (repeat === 'all') return <IconRepeat />;
    if (repeat === 'one') return <IconRepeatOne />;
    return <IconRepeat />;
  };

  const handleToggleFavorite = async () => {
    if (!currentTrack || favLoading) return;
    setFavLoading(true);
    await toggleFavorite(currentTrack.id);
    setFavLoading(false);
  };

  const accentSolidStyle: React.CSSProperties = {
    background: 'var(--accent, #6ee29e)',
    color: '#000',
  };

  if (isLoadingTrack && currentTrack) {
    return (
      <footer
        className="flex-shrink-0 rounded-xl flex flex-col lg:flex-row items-center px-4 lg:px-6 py-3 gap-3 lg:gap-4 transition-all duration-200"
        style={{
          background: 'var(--bg-card, #1e1e1e)',
          border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
        }}
      >
        <div className="flex items-center gap-4 w-full justify-center">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center relative"
              style={{
                background: 'linear-gradient(135deg, var(--bg-base, rgba(255,255,255,0.05)) 0%, var(--bg-card, #1e1e1e) 100%)',
                border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                color: 'var(--accent, #6ee29e)',
              }}
            >
              <IconLoading />
              {loadingTimeout && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary, #fff)' }}>
                {loadingTimeout ? 'Tardando más de lo esperado...' : 'Cargando track...'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.6))' }}>
                {loadingTimeout ? 'Click en el botón para intentar reproducir' : currentTrack?.title}
              </p>
            </div>
            {loadingTimeout && (
              <button
                onClick={async () => {
                  const audio = new Audio();
                  const sourceUrl = currentTrack.filename
                    ? `/api/tracks/stream?id=${currentTrack.id}`
                    : (currentTrack.link ?? '');
                  if (sourceUrl) {
                    audio.src = sourceUrl;
                    try {
                      await audio.play();
                      window.location.reload();
                    } catch (e) {
                      console.error("Error en fallback:", e);
                    }
                  }
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'var(--accent, #6ee29e)',
                  color: '#000',
                }}
              >
                Reintentar
              </button>
            )}
          </div>
        </div>
      </footer>
    );
  }

  if (!currentTrack) {
    return (
      <footer
        className="flex-shrink-0 rounded-xl flex flex-col lg:flex-row items-center px-4 lg:px-6 py-3 gap-3 lg:gap-4 transition-all duration-200"
        style={{
          background: 'var(--bg-card, #1e1e1e)',
          border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
        }}
      >
        <div className="flex items-center gap-4 w-full lg:w-[280px] min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold select-none"
              style={{
                background: 'linear-gradient(135deg, var(--bg-base, rgba(255,255,255,0.05)) 0%, var(--bg-card, #1e1e1e) 100%)',
                border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
              }}
            >
              <span className="text-sm opacity-40">■</span>
            </div>
            <div>
              <p className="text-sm font-medium opacity-40">Ningún elemento</p>
              <p className="text-xs opacity-30 mt-0.5">Selecciona un track o stream</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  const trackIsFavorite = currentTrack ? isFavorite(currentTrack.id) : false;

  const handleNextClick = () => {
    if (blocked) return;
    if (queue.length === 0 || !currentTrack) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === queue.length - 1) {
      playTrack(queue[0]);
    } else {
      nextTrack();
    }
  };

  return (
    <footer
      className="flex-shrink-0 rounded-xl flex flex-col lg:flex-row items-center px-4 lg:px-6 py-3 gap-3 lg:gap-4 transition-all duration-200 shadow-xl"
      style={{
        background: 'var(--bg-card, #1e1e1e)',
        border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
      }}
    >
      <div className="flex items-center gap-4 w-full lg:w-[280px] min-w-0 justify-between lg:justify-start">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={currentTrack.playlistId ? `/playlists/${currentTrack.playlistId}` : '#'}
            onClick={(e) => {
              if (!currentTrack.playlistId) e.preventDefault();
            }}
            className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center select-none relative transition-all hover:scale-105 hover:border-[var(--accent)]"
            style={{
              background: 'linear-gradient(135deg, var(--bg-base, rgba(255,255,255,0.05)) 0%, var(--bg-card, #1e1e1e) 100%)',
              border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
              color: 'var(--accent, #6ee29e)',
              cursor: currentTrack.playlistId ? 'pointer' : 'default',
            }}
            title={currentTrack.playlistName || ''}
          >
            {isLoadingTrack ? <IconLoading /> : <IconMusic />}
          </Link>

          <div className="min-w-0 relative group/track">
            <TruncatedText
              text={currentTrack?.title || ''}
              className="text-base font-bold max-w-[140px] sm:max-w-[180px]"
            />
            <p className="text-sm truncate mt-0.5" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.6))' }}>
              {currentTrack?.artist || 'Artista desconocido'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleFavorite}
            disabled={blocked || favLoading}
            className="p-2 rounded-full transition-all active:scale-90 hover:scale-110"
            style={{
              color: trackIsFavorite ? '#f87171' : 'var(--accent, #6ee29e)',
              background: 'transparent',
            }}
          >
            {favLoading ? <IconLoading /> : (trackIsFavorite ? <IconHeart /> : <IconHeartOutline />)}
          </button>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center gap-1.5 max-w-[600px] mx-auto min-w-0">
        <div className="hidden lg:flex items-center justify-center gap-4 h-9">
          <button
            onClick={toggleShuffle}
            disabled={blocked}
            className="p-1 transition-all hover:scale-110 rounded-full hover:bg-[rgba(110,226,158,0.08)] p-2"
            style={{
              color: shuffle ? 'var(--accent, #6ee29e)' : 'var(--text-muted, rgba(255,255,255,0.3))',
            }}
          >
            <IconShuffle />
          </button>
          <button
            onClick={prevTrack}
            disabled={blocked}
            className="p-1 transition-all hover:scale-110 rounded-full hover:bg-[rgba(110,226,158,0.08)] p-2"
            style={{ color: 'var(--accent, #6ee29e)' }}
          >
            <IconSkipPrev />
          </button>
          <button
            onClick={togglePlay}
            disabled={blocked}
            className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(110,226,158,0.3)]"
            style={accentSolidStyle}
          >
            {isLoadingTrack ? <IconLoading /> : isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <button
            onClick={handleNextClick}
            disabled={blocked}
            className="p-1 transition-all hover:scale-110 rounded-full hover:bg-[rgba(110,226,158,0.08)] p-2"
            style={{ color: 'var(--accent, #6ee29e)' }}
          >
            <IconSkipNext />
          </button>
          <button
            onClick={toggleRepeat}
            disabled={blocked}
            className="p-1 transition-all hover:scale-110 rounded-full hover:bg-[rgba(110,226,158,0.08)] p-2"
            style={{
              color: repeat !== 'off' ? 'var(--accent, #6ee29e)' : 'var(--text-muted, rgba(255,255,255,0.3))',
              opacity: repeat !== 'off' ? 1 : 0.5,
            }}
          >
            {getRepeatIcon()}
          </button>
        </div>

        <div className="w-full flex items-center gap-3 px-1 select-none min-w-0">
          <span className="text-sm tabular-nums w-10 text-right font-medium shrink-0" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.7))' }}>
            {currentTimeStr || '0:00'}
          </span>
          <div
            ref={progressBarRef}
            onClick={handleWaveformClick}
            className={`flex-1 min-w-0 h-5 flex items-center justify-between relative group/wave ${blocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="absolute inset-0 flex items-center justify-between gap-[2px]">
              {displayWaveform.map((height, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-full transition-all fenix-waveform-bg"
                  style={{
                    height: `${Math.max(2, height * 0.6)}px`,
                    minHeight: '2px',
                    backgroundColor: 'var(--waveform-bg, rgba(255,255,255,0.1))',
                  }}
                />
              ))}
            </div>
            <div
              className="absolute inset-0 flex items-center justify-between gap-[2px] pointer-events-none overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
            >
              {displayWaveform.map((height, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-full transition-all fenix-waveform-active"
                  style={{
                    height: `${Math.max(2, height * 0.6)}px`,
                    minHeight: '2px',
                    backgroundColor: 'var(--accent, #6ee29e)',
                  }}
                />
              ))}
            </div>
          </div>
          <span className="text-sm tabular-nums w-10 font-medium shrink-0" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.7))' }}>
            {durationStr || '0:00'}
          </span>
        </div>

        <div className="flex lg:hidden items-center justify-center gap-6 h-9">
          <button
            onClick={toggleShuffle}
            disabled={blocked}
            className="p-1 transition-all hover:scale-110 rounded-full active:scale-90"
            style={{ color: shuffle ? 'var(--accent, #6ee29e)' : 'rgba(255,255,255,0.35)' }}
          >
            <IconShuffle />
          </button>
          <button
            onClick={prevTrack}
            disabled={blocked}
            className="p-1 transition-all hover:scale-110 rounded-full active:scale-90"
            style={{ color: 'var(--accent, #6ee29e)' }}
          >
            <IconSkipPrev />
          </button>
          <button
            onClick={togglePlay}
            disabled={blocked}
            className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90"
            style={accentSolidStyle}
          >
            {isLoadingTrack ? <IconLoading /> : isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <button
            onClick={handleNextClick}
            disabled={blocked}
            className="p-1 transition-all hover:scale-110 rounded-full active:scale-90"
            style={{ color: 'var(--accent, #6ee29e)' }}
          >
            <IconSkipNext />
          </button>
          <button
            onClick={toggleRepeat}
            disabled={blocked}
            className="p-1 transition-all hover:scale-110 rounded-full active:scale-90"
            style={{ color: repeat !== 'off' ? 'var(--accent, #6ee29e)' : 'rgba(255,255,255,0.35)' }}
          >
            {getRepeatIcon()}
          </button>
        </div>

        <div className="flex lg:hidden items-center gap-2.5 w-full px-1">
          <button
            onClick={toggleMute}
            disabled={!currentTrack}
            className="transition-all active:scale-90 shrink-0"
            style={{ color: 'var(--accent, #6ee29e)' }}
          >
            {isMuted ? <IconVolumeMute /> : <IconVolume />}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={e => changeVolume(Number(e.target.value))}
            disabled={!currentTrack}
            className="flex-1 h-1 appearance-none rounded-full cursor-pointer fenix-range"
            style={{
              background: `linear-gradient(to right, var(--accent, #6ee29e) 0%, var(--accent, #6ee29e) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.1) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
          <span className="text-xs tabular-nums w-8 font-medium text-right shrink-0" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.7))' }}>
            {isMuted ? 0 : volume}%
          </span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3 w-[200px] justify-end h-full shrink-0">
        <button
          onClick={toggleMute}
          disabled={!currentTrack}
          className="transition-all hover:scale-110 p-2 rounded-full hover:bg-[rgba(110,226,158,0.08)]"
          style={{ color: 'var(--accent, #6ee29e)' }}
        >
          {isMuted ? <IconVolumeMute /> : <IconVolume />}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={isMuted ? 0 : volume}
          onChange={e => changeVolume(Number(e.target.value))}
          disabled={!currentTrack}
          className="w-24 h-1 appearance-none rounded-full cursor-pointer transition-all fenix-range"
          style={{
            background: `linear-gradient(to right, var(--accent, #6ee29e) 0%, var(--accent, #6ee29e) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.1) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.1) 100%)`
          }}
        />
        <span className="text-sm tabular-nums w-8 font-medium text-right" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.7))' }}>
          {isMuted ? 0 : volume}%
        </span>
      </div>
    </footer>
  );
}