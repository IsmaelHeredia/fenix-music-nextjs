'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';

type MediaEntry = { label: string; order: number };
type MediaEntries = Record<string, MediaEntry>;
type SetMedia = (source: string, label: string | null) => void;

const EntriesContext = createContext<MediaEntries>({});
const SetMediaContext = createContext<SetMedia>(() => { });

export function TabTitleProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<MediaEntries>({});
  const counter = useRef(0);

  const setMedia = useCallback<SetMedia>((source, label) => {
    const order = ++counter.current;
    setEntries(prev => {
      if (label === null) {
        if (!(source in prev)) return prev;
        const next = { ...prev };
        delete next[source];
        return next;
      }
      if (prev[source]?.label === label) return prev;
      return { ...prev, [source]: { label, order } };
    });
  }, []);

  return (
    <SetMediaContext.Provider value={setMedia}>
      <EntriesContext.Provider value={entries}>
        {children}
      </EntriesContext.Provider>
    </SetMediaContext.Provider>
  );
}

export function useMediaTitle(source: string, label: string | null) {
  const setMedia = useContext(SetMediaContext);

  useEffect(() => {
    setMedia(source, label);
    return () => setMedia(source, null);
  }, [source, label, setMedia]);
}

export function useMediaEntries() {
  return useContext(EntriesContext);
}