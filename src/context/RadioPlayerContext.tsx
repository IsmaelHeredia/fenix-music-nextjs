'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface RadioStationItem {
  id: number | string;
  name: string;
  link: string;
  categories?: string | null;
}

interface RadioPlayerContextType {
  currentStation: RadioStationItem | null;
  isRadioPlaying: boolean;
  error: string | null;
  setError: (msg: string | null) => void;
  playRadio: (station: RadioStationItem) => void;
  stopRadio: () => void;
  toggleRadio: () => void;
}

const RadioPlayerContext = createContext<RadioPlayerContextType | undefined>(undefined);

export function RadioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentStation, setCurrentStation] = useState<RadioStationItem | null>(null);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isUserPaused = useRef(false);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleError = () => {
      if (!isUserPaused.current) {
        setError("No se pudo conectar con la estación. Verifica la URL.");
        setIsRadioPlaying(false);
      }
    };

    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const playRadio = (station: RadioStationItem) => {
    if (!audioRef.current) return;

    isUserPaused.current = false;
    setError(null);

    audioRef.current.src = station.link;
    audioRef.current.load();
    setCurrentStation(station);

    audioRef.current.play()
      .then(() => setIsRadioPlaying(true))
      .catch((err) => {
        console.error(err);
        setError("Error: El stream no está disponible o es inválido");
        setIsRadioPlaying(false);
      });
  };

  const stopRadio = () => {
    isUserPaused.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsRadioPlaying(false);
    }
  };

  const toggleRadio = () => {
    if (!currentStation) return;
    isRadioPlaying ? stopRadio() : playRadio(currentStation);
  };

  return (
    <RadioPlayerContext.Provider value={{ currentStation, isRadioPlaying, error, setError, playRadio, stopRadio, toggleRadio }}>
      {children}
    </RadioPlayerContext.Provider>
  );
}

export function useRadioPlayer() {
  const context = useContext(RadioPlayerContext);
  if (!context) throw new Error('useRadioPlayer debe estar dentro de RadioPlayerProvider');
  return context;
}