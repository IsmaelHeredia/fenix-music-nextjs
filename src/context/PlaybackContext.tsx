'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type PlayableItem = {
  id: number;
  title: string;
  artist: string;
  filename?: string;
  link?: string;
  durationString?: string | null;
  position: number;
  isFavorite?: boolean;
  waveform?: string | null;
  playlistId?: number | string | null;
  playlistName?: string | null;
};

type RepeatMode = 'off' | 'all' | 'one';

interface PlayerContextType {
  currentTrack: PlayableItem | null;
  queue: PlayableItem[];
  isPlaying: boolean;
  isLoadingTrack: boolean;
  volume: number;
  progress: number;
  currentTimeStr: string;
  durationStr: string;
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  playTrack: (track: PlayableItem, newQueue?: PlayableItem[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  changeVolume: (val: number) => void;
  changeProgress: (percent: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  updateQueue: (newQueue: PlayableItem[]) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<PlayableItem | null>(null);
  const [queue, setQueue] = useState<PlayableItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingTrack, setIsLoadingTrack] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const waveformIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stateRef = useRef({ queue, currentTrack, repeat, shuffle });
  useEffect(() => {
    stateRef.current = { queue, currentTrack, repeat, shuffle };
  }, [queue, currentTrack, repeat, shuffle]);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      setProgress(pct);
      const curM = Math.floor(audio.currentTime / 60);
      const curS = Math.floor(audio.currentTime % 60);
      setCurrentTimeStr(`${curM}:${curS.toString().padStart(2, '0')}`);
    };

    const onLoadedMetadata = () => {
      const durM = Math.floor(audio.duration / 60);
      const durS = Math.floor(audio.duration % 60);
      setDurationStr(`${durM}:${durS.toString().padStart(2, '0')}`);
    };

    const onCanPlay = () => {
      if (!stateRef.current.currentTrack?.filename) {
        setIsLoadingTrack(false);
        audio.play().then(() => setIsPlaying(true)).catch(() => { });
      }
    };

    const onEnded = () => {
      const { queue: currentQueue, currentTrack: activeTrack, repeat: currentRepeat, shuffle: isShuffleActive } = stateRef.current;

      if (currentRepeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => { });
        return;
      }

      if (currentQueue.length === 0 || !activeTrack) {
        if (currentRepeat === 'all' && currentQueue.length > 0) {
          playTrack(currentQueue[0]);
        }
        return;
      }

      if (isShuffleActive) {
        const randomIndex = Math.floor(Math.random() * currentQueue.length);
        playTrack(currentQueue[randomIndex]);
        return;
      }

      const currentIndex = currentQueue.findIndex(t => t.id === activeTrack.id);

      if (currentRepeat === 'all') {
        if (currentIndex !== -1 && currentIndex < currentQueue.length - 1) {
          playTrack(currentQueue[currentIndex + 1]);
        } else if (currentQueue.length > 0) {
          playTrack(currentQueue[0]);
        }
      } else {
        if (currentIndex !== -1 && currentIndex < currentQueue.length - 1) {
          playTrack(currentQueue[currentIndex + 1]);
        }
      }
    };

    const onError = () => {
      setIsLoadingTrack(false);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  const safePlayAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(err => console.error("Error disparando reproducción síncrona:", err));
  };

  useEffect(() => {
    if (!currentTrack) return;

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    if (waveformIntervalRef.current) {
      clearInterval(waveformIntervalRef.current);
      waveformIntervalRef.current = null;
    }

    if (currentTrack.waveform) {
      setIsLoadingTrack(false);
      if (currentTrack.filename) {
        safePlayAudio();
      }
      return;
    }

    if (!currentTrack.filename && !currentTrack.link) {
      console.warn("[PLAYER] No hay fuente para reproducir");
      setIsLoadingTrack(false);
      return;
    }

    loadingTimeoutRef.current = setTimeout(() => {
      console.warn("[WAVEFORM] Timeout global alcanzado. Liberando controles.");
      setIsLoadingTrack(false);
      safePlayAudio();
      if (waveformIntervalRef.current) {
        clearInterval(waveformIntervalRef.current);
        waveformIntervalRef.current = null;
      }
      loadingTimeoutRef.current = null;
    }, 25000);

    let counter = 0;
    const MAX_ATTEMPTS = 15;

    const checkWaveform = async () => {
      try {
        const res = await fetch(`/api/tracks/waveform?id=${currentTrack.id}`);
        if (!res.ok) return;

        const data = await res.json();

        if (data.waveform) {
          setCurrentTrack(prev => {
            if (!prev || prev.id !== currentTrack.id) return prev;
            return { ...prev, waveform: data.waveform };
          });

          if (waveformIntervalRef.current) {
            clearInterval(waveformIntervalRef.current);
            waveformIntervalRef.current = null;
          }
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
          }

          setIsLoadingTrack(false);
          safePlayAudio();
          return;
        }
      } catch (e) {
        console.error("[POLLING_WAVEFORM] Error consultando picos:", e);
      }

      counter++;

      if (counter >= MAX_ATTEMPTS) {
        console.warn("[WAVEFORM] Máximo de intentos alcanzado. Liberando controles.");
        setIsLoadingTrack(false);
        safePlayAudio();
        if (waveformIntervalRef.current) {
          clearInterval(waveformIntervalRef.current);
          waveformIntervalRef.current = null;
        }
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
      }
    };

    waveformIntervalRef.current = setInterval(checkWaveform, 1000);

    return () => {
      if (waveformIntervalRef.current) {
        clearInterval(waveformIntervalRef.current);
        waveformIntervalRef.current = null;
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [currentTrack?.id, currentTrack?.waveform]);

  const playTrack = (track: PlayableItem, newQueue?: PlayableItem[]) => {
    if (!audioRef.current) return;

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    if (waveformIntervalRef.current) {
      clearInterval(waveformIntervalRef.current);
      waveformIntervalRef.current = null;
    }

    setIsLoadingTrack(true);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTimeStr('0:00');
    setDurationStr('0:00');

    if (newQueue) setQueue(newQueue);
    setCurrentTrack(track);

    const sourceUrl = track.filename
      ? `/api/tracks/stream?id=${track.id}`
      : (track.link ?? '');

    audioRef.current.src = sourceUrl;
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack || isLoadingTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
    }
  };

  const nextTrack = () => {
    const { queue: currentQueue, currentTrack: activeTrack, shuffle: isShuffleActive, repeat: currentRepeat } = stateRef.current;
    if (currentQueue.length === 0 || !activeTrack) return;

    if (currentRepeat === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => { });
      }
      return;
    }

    if (isShuffleActive) {
      const randomIndex = Math.floor(Math.random() * currentQueue.length);
      playTrack(currentQueue[randomIndex]);
      return;
    }

    const currentIndex = currentQueue.findIndex(t => t.id === activeTrack.id);
    if (currentIndex !== -1 && currentIndex < currentQueue.length - 1) {
      playTrack(currentQueue[currentIndex + 1]);
    } else if (currentRepeat === 'all' && currentQueue.length > 0) {
      playTrack(currentQueue[0]);
    }
  };

  const prevTrack = () => {
    const { queue: currentQueue, currentTrack: activeTrack } = stateRef.current;
    if (currentQueue.length === 0 || !activeTrack) return;

    const currentIndex = currentQueue.findIndex(t => t.id === activeTrack.id);
    if (currentIndex > 0) {
      playTrack(currentQueue[currentIndex - 1]);
    } else {
      playTrack(currentQueue[currentQueue.length - 1]);
    }
  };

  const changeVolume = (val: number) => {
    setVolume(val);
    if (val > 0) setIsMuted(false);
  };

  const changeProgress = (percent: number) => {
    if (!audioRef.current || !audioRef.current.duration || isLoadingTrack) return;
    const newTime = (percent / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(percent);
  };

  const toggleMute = () => setIsMuted(p => !p);
  const toggleShuffle = () => setShuffle(p => !p);

  const toggleRepeat = () => {
    setRepeat(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const updateQueue = (newQueue: PlayableItem[]) => setQueue(newQueue);

  return (
    <PlayerContext.Provider value={{
      currentTrack, queue, isPlaying, isLoadingTrack, volume, progress,
      currentTimeStr, durationStr, isMuted, shuffle, repeat,
      playTrack, togglePlay, nextTrack, prevTrack, changeVolume,
      changeProgress, toggleMute, toggleShuffle, toggleRepeat, updateQueue
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer debe usarse dentro de un PlayerProvider');
  return context;
}