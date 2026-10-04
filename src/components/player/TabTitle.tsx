'use client';

import { useEffect, useMemo } from 'react';
import { usePlayer } from '@/context/PlaybackContext';
import { useRadioPlayer } from '@/context/RadioPlayerContext';
import { useMediaTitle, useMediaEntries } from '@/context/TabTitleContext';

export function TabTitle() {
  const { currentTrack, isPlaying, isLoadingTrack } = usePlayer();
  const { currentStation, isRadioPlaying } = useRadioPlayer();
  const entries = useMediaEntries();

  const musicActive = (isPlaying || isLoadingTrack) && !!currentTrack;
  const title = currentTrack?.title ?? '';
  const artist = currentTrack?.artist ?? '';
  const hasArtist = !!artist && artist !== 'Unknown Artist';

  const musicLabel = musicActive && title ? (hasArtist ? `${title} - ${artist}` : title) : null;
  const radioLabel = isRadioPlaying && currentStation ? currentStation.name : null;

  useMediaTitle('music', musicLabel);
  useMediaTitle('radio', radioLabel);

  const label = useMemo(() => {
    const list = Object.values(entries);
    if (list.length === 0) return null;
    return list.reduce((a, b) => (b.order > a.order ? b : a)).label;
  }, [entries]);

  useEffect(() => {
    if (!label) return;

    const full = `${label} ♫`.replace(/\s+/g, ' ').trim();
    let original = document.title;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;
    let observedTitle: Element | null = null;

    document.title = full;

    const sync = () => {
      timer = null;
      if (disposed || document.title === full) return;
      original = document.title;
      document.title = full;
    };

    const schedule = () => {
      if (timer !== null || document.title === full) return;
      timer = setTimeout(sync, 50);
    };

    const titleObserver = new MutationObserver(schedule);

    const attach = () => {
      const el = document.head.querySelector('title');
      if (el === observedTitle) return;
      titleObserver.disconnect();
      observedTitle = el;
      if (el) {
        titleObserver.observe(el, { childList: true, characterData: true, subtree: true });
      }
      schedule();
    };

    const headObserver = new MutationObserver(attach);
    headObserver.observe(document.head, { childList: true });
    attach();

    return () => {
      disposed = true;
      if (timer !== null) clearTimeout(timer);
      titleObserver.disconnect();
      headObserver.disconnect();
      if (document.title === full) {
        document.title = original;
      }
    };
  }, [label]);

  return null;
}