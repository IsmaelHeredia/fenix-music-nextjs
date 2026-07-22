'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { SettingsSkeleton } from '@/components/skeletons/settings/SettingsSkeleton';

export default function SettingsPage() {

  useEffect(() => {
    document.title = 'Ajustes';
  }, []);

  const [musicDir, setMusicDir] = useState('');
  const [videoDir, setVideoDir] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ added: number; skipped: number; duration: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const resSettings = await fetch('/api/settings');
        if (resSettings.ok) {
          const data = await resSettings.json();
          setMusicDir(data.music_directory || '');
          setVideoDir(data.video_directory || '');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error al cargar la configuración');
      }
      finally { setIsInitialized(true); }
    }
    loadData();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ music_directory: musicDir, video_directory: videoDir })
      });

      if (res.ok) {
        toast.success('Configuración guardada exitosamente');
      } else {
        toast.error('Error al guardar la configuración');
      }
    } catch (err) {
      toast.error('Error al guardar la configuración');
    }
    finally { setIsSaving(false); }
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify({
          music_directory: musicDir,
          video_directory: videoDir,
          trigger_scan: true
        })
      });

      const data = await res.json();
      if (data.success && data.scan_stats) {
        setScanResult(data.scan_stats);
        toast.success('Escaneo completado');
        setTimeout(() => setScanResult(null), 10000);
      } else {
        toast.error('No se pudieron obtener las estadísticas de escaneo');
      }
    } catch (err) {
      toast.error('Error de conexión');
    }
    finally { setIsScanning(false); }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">

      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        <Link
          href="/tracks"
          className="transition hover:opacity-100 opacity-60"
          style={{ color: 'var(--text-secondary)' }}
        >
          Biblioteca
        </Link>
        <span className="opacity-30">/</span>
        <span style={{ color: 'var(--text-primary)' }}>Ajustes</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
        <div className="flex items-end gap-4 sm:gap-5 min-w-0">
          <div
            className="w-16 h-16 sm:w-[88px] sm:h-[88px] rounded-2xl flex items-center justify-center shrink-0 select-none"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            <svg
              width="36"
              height="36"
              className="sm:w-12 sm:h-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(0 0 6px var(--accent-glow))'
              }}
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="var(--accent)" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div className="pb-1 space-y-1 min-w-0">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--accent)' }}>
              Configuración
            </p>
            <h1 className="text-2xl sm:text-[28px] font-bold leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
              Ajustes del Sistema
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Gestiona e indexa tu almacenamiento de medios locales
            </p>
          </div>
        </div>
      </div>

      {!isInitialized ? (
        <SettingsSkeleton />
      ) : (
        <div className="space-y-6">
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-5" style={{ background: 'var(--accent)' }} />
            
            <div className="p-4 sm:p-6 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--tag-bg)' }}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                    Directorios de Medios Locales
                  </h2>
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving || isScanning}
                  className="h-10 px-5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
                  style={{
                    background: 'transparent',
                    border: '1.5px solid var(--accent)',
                    color: 'var(--accent)',
                  }}
                  onMouseEnter={e => {
                    if (!isSaving && !isScanning) {
                      e.currentTarget.style.background = 'rgba(110,226,158,0.08)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  {isSaving ? 'Guardando...' : 'Guardar Carpetas'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                    Carpeta de Música
                  </label>
                  <input
                    type="text"
                    value={musicDir}
                    disabled={isScanning}
                    onChange={(e) => setMusicDir(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-[14px] font-mono outline-none transition-all duration-200 focus:scale-[1.01] disabled:opacity-50"
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="/ruta/a/tu/música"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                      <polygon points="10 8 16 12 10 16 10 8" />
                    </svg>
                    Carpeta de Vídeos
                  </label>
                  <input
                    type="text"
                    value={videoDir}
                    disabled={isScanning}
                    onChange={(e) => setVideoDir(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-[14px] font-mono outline-none transition-all duration-200 focus:scale-[1.01] disabled:opacity-50"
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="/ruta/a/tus/videos"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full opacity-5" style={{ background: 'var(--accent)' }} />
            
            <div className="p-4 sm:p-6 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--tag-bg)' }}>
                      {isScanning ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5" />
                          <path d="M2 12l10 5 10-5" />
                        </svg>
                      )}
                    </div>
                    <h2 className="text-base sm:text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {isScanning ? 'Indexando...' : 'Motor de Indexación'}
                    </h2>
                  </div>
                  <p className="text-xs sm:ml-[52px]" style={{ color: 'var(--text-secondary)' }}>
                    Al iniciar, el sistema buscará nuevos archivos y eliminará los borrados
                  </p>
                </div>

                <button
                  disabled={isScanning || !musicDir}
                  onClick={handleStartScan}
                  className="h-12 px-6 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full md:w-auto shrink-0"
                  style={{
                    background: 'var(--btn-action-bg)',
                    color: 'var(--btn-action-text)',
                    boxShadow: '0 4px 15px var(--accent-glow)',
                  }}
                  onMouseEnter={e => {
                    if (!isScanning && musicDir) {
                      e.currentTarget.style.background = 'var(--btn-action-bg-hover)';
                      e.currentTarget.style.boxShadow = '0 6px 25px var(--accent-glow)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--btn-action-bg)';
                    e.currentTarget.style.boxShadow = '0 4px 15px var(--accent-glow)';
                  }}
                >
                  {isScanning ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin shrink-0" />
                      Escaneando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      Iniciar Escaneo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {scanResult && (
            <div
              className="rounded-2xl p-4 sm:p-5 animate-fadeIn relative overflow-hidden"
              style={{
                background: 'var(--scan-result-bg)',
                border: '1px solid var(--scan-result-border)',
              }}
            >
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10" style={{ background: 'var(--accent)' }} />
              
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(110,226,158,0.15)' }}>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="font-bold mb-1" style={{ color: 'var(--scan-result-text)' }}>
                    ¡Escaneo completado!
                  </p>
                  <p className="text-sm" style={{ color: 'var(--scan-result-sub)' }}>
                    Se añadieron <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{scanResult.added}</span> elementos.
                    {scanResult.skipped > 0 && ` Se omitieron ${scanResult.skipped}.`}
                    {' '}Duración: <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{scanResult.duration}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}