'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const IconHome = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>;

const IconMusic = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;

const IconPlaylists = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>;

const IconCustomList = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>;

const IconRadio = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" /><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" /><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" /><path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2" /></svg>;

const IconVideo = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="4" width="20" height="16" rx="2" ry="2" /><polygon points="10 8 16 12 10 16 10 8" /></svg>;

const IconLive = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" /><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" /><circle cx="12" cy="12" r="2" fill="currentColor" /><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" /><path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2" /><rect x="11" y="14" width="2" height="4" fill="currentColor" stroke="none" /></svg>;

const IconSettings = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="currentColor" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;

const IconHeart = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>;

const NAV_LINKS = [
  { href: '/', label: 'Inicio', icon: <IconHome /> },
  { href: '/tracks', label: 'Canciones', icon: <IconMusic /> },
  { href: '/playlists', label: 'Listas', icon: <IconPlaylists /> },
  { href: '/custom-playlists', label: 'Listas personalizadas', icon: <IconCustomList /> },
  { href: '/stations', label: 'Estaciones', icon: <IconRadio /> },
  { href: '/videos', label: 'Videos', icon: <IconVideo /> },
  { href: '/livestreams', label: 'Live Streams', icon: <IconLive /> },
  { href: '/settings', label: 'Ajustes', icon: <IconSettings /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside
      className="flex w-16 md:w-64 flex-shrink-0 flex-col h-full rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: 'var(--bg-card, #1e1e1e)',
        border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
      }}
    >
      <div className="px-3.5 md:px-5 pt-6 pb-5 select-none flex justify-center md:justify-start flex-shrink-0">
        <div className="flex items-center gap-2.5" title="FENIX MUSIC">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="/logo-fenix.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="hidden md:block text-xl font-black tracking-tight" style={{ color: 'var(--text-primary, #fff)' }}>
            FENIX MUSIC
          </span>
        </div>
      </div>

      <nav className="px-2 md:px-3 py-4 space-y-1 flex-1 min-h-0 overflow-y-auto fenix-content-scroll flex flex-col items-center md:items-stretch">
        {NAV_LINKS.map(({ href, label, icon }) => {
          const active = isActive(href);
          return (
            <Link 
              key={href} 
              href={href} 
              title={label}
              className="flex items-center justify-center md:justify-start gap-3 w-12 h-11 md:w-auto md:h-auto px-0 md:px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden shrink-0"
              style={{
                background: active ? 'rgba(110,226,158,0.1)' : 'transparent',
                color: active ? 'var(--accent, #6ee29e)' : 'var(--text-secondary, rgba(255,255,255,0.75))',
              }}
            >
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full" style={{ background: 'var(--accent, #6ee29e)' }} />}
              <span className="shrink-0" style={{ color: active ? 'var(--accent, #6ee29e)' : 'var(--text-muted, rgba(255,255,255,0.55))' }}>{icon}</span>
              <span className="hidden md:block group-hover:text-[var(--text-primary)] transition-colors duration-200 truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-2 md:px-4 py-5 border-t flex-shrink-0 flex flex-col items-center md:items-stretch" style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.06))' }}>
        <p className="hidden md:block text-[10px] font-semibold uppercase tracking-wider mb-3 px-2 select-none" style={{ color: 'var(--text-muted, rgba(255,255,255,0.45))' }}>
          Acceso rápido
        </p>

        <Link href="/favorites" className="block group w-full" title="Canciones Favoritas">
          <div
            className="relative rounded-xl overflow-hidden p-2 md:p-3.5 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex justify-center md:justify-start"
            style={{
              background: 'rgba(110,226,158,0.08)',
              border: '1px solid var(--accent, rgba(110,226,158,0.2))',
            }}
          >
            <div className="relative flex items-center gap-3">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--accent, #6ee29e)' }}>
                <div style={{ color: '#000' }}><IconHeart /></div>
              </div>
              <div className="hidden md:block min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight truncate" style={{ color: 'var(--text-primary, #fff)' }}>
                  Canciones Favoritas
                </p>
                <p className="text-xs font-medium mt-1 truncate" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.65))' }}>
                  Tu colección personal
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}