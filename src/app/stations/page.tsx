'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRadioPlayer, RadioStationItem } from '@/context/RadioPlayerContext';
import { usePlayer } from '@/context/PlaybackContext';
import StationModal from '@/components/modals/StationModal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { StationGridSkeleton } from '@/components/skeletons/stations/StationGridSkeleton';
import { ValidationModal } from '@/components/modals/ValidationModal';
import { TruncatedText } from '@/components/ui/TruncatedText';

export default function StationsPage() {

  useEffect(() => {
    document.title = 'Estaciones';
  }, []);

  const [stations, setStations] = useState<RadioStationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showActions, setShowActions] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<RadioStationItem | null>(null);

  const [isValidating, setIsValidating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [brokenStations, setBrokenStations] = useState<RadioStationItem[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentStation, isRadioPlaying, playRadio, toggleRadio, error, setError } = useRadioPlayer();
  const { isPlaying: isMusicPlaying, togglePlay: pauseMusic } = usePlayer();

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error, setError]);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const res = await fetch('/api/stations');
      if (res.ok) setStations(await res.json());
    } catch (err) {
      console.error("Error leyendo estaciones de radio locales:", err);
      toast.error('Error al cargar las estaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      const res = await fetch('/api/stations', {
        method: editingStation ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, id: editingStation?.id })
      });
      if (res.ok) {
        toast.success(editingStation ? 'Estación actualizada' : 'Estación creada');
        setIsModalOpen(false);
        setEditingStation(null);
        fetchStations();
      } else {
        toast.error('Error al guardar la estación');
      }
    } catch (err) { toast.error("Error al guardar la estación"); }
  };

  const handleExport = () => {
    const exportData = stations.map(({ id, ...rest }) => rest);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estaciones_fenix.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exportadas ${exportData.length} estaciones`);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Importando estaciones...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed)) {
          throw new Error('El JSON debe ser un array de estaciones');
        }

        const res = await fetch('/api/stations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed),
        });

        if (!res.ok) throw new Error('Error en la importación');

        const data = await res.json();
        const skippedMsg = data.skipped > 0 ? ` · ${data.skipped} omitidas (repetidas o inválidas)` : '';

        toast.update(toastId, {
          render: `✅ ${data.imported} estaciones importadas${skippedMsg}`,
          type: 'success',
          isLoading: false,
          autoClose: 4000,
        });
        fetchStations();
      } catch (err) {
        toast.update(toastId, {
          render: '❌ Archivo JSON inválido o error al importar',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const requestDelete = (id: number, name: string) => setDeleteTarget({ id, name });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/stations?id=${deleteTarget.id}&type=stations`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Error al eliminar la estación'); return; }
      setStations(prev => prev.filter(s => s.id !== deleteTarget.id));
      toast.info('Estación eliminada');
    } catch {
      toast.error('Error de red al eliminar');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    const toastId = toast.loading('Validando estaciones...');

    try {
      const res = await fetch('/api/stations/maintenance');
      if (!res.ok) throw new Error('Error en la validación');

      const data = await res.json();
      const broken = data.broken || [];

      toast.update(toastId, {
        render: broken.length === 0 ? '✅ Todas las estaciones funcionan correctamente' : `⚠️ Se encontraron ${broken.length} estaciones fallidas`,
        type: broken.length === 0 ? 'success' : 'warning',
        isLoading: false,
        autoClose: 3000
      });

      if (broken.length > 0) {
        setBrokenStations(broken);
        setValidationModalOpen(true);
      }
    } catch (err) {
      toast.update(toastId, {
        render: '❌ Error al validar las estaciones',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleConfirmDelete = async (ids: number[]) => {
    setIsDeleting(true);
    const toastId = toast.loading(`Eliminando ${ids.length} estaciones...`);

    try {
      const deletePromises = ids.map(id =>
        fetch(`/api/stations?id=${id}&type=stations`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);

      toast.update(toastId, {
        render: `🗑️ Se eliminaron ${ids.length} estaciones fallidas`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      setValidationModalOpen(false);
      setBrokenStations([]);
      fetchStations();
    } catch (err) {
      toast.update(toastId, {
        render: '❌ Error al eliminar las estaciones',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRadioAction = (station: RadioStationItem) => {
    if (isMusicPlaying) pauseMusic();
    playRadio(station);
  };

  const allCategories = useMemo(() => {
    return ['Todas', ...Array.from(new Set(
      stations.flatMap(s => s.categories ? s.categories.split(',') : [])
    ))];
  }, [stations]);

  const filteredStations = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return stations.filter(s =>
      s.name.toLowerCase().includes(query) &&
      (activeCategory === 'Todas' || s.categories?.includes(activeCategory))
    );
  }, [stations, searchQuery, activeCategory]);

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">

      <ValidationModal
        isOpen={validationModalOpen}
        onClose={() => setValidationModalOpen(false)}
        brokenStations={brokenStations}
        onConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />

      {deleteTarget && (
        <ConfirmModal
          name={deleteTarget.name}
          itemLabel="estación"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
        <Link
          href="/tracks"
          className="transition hover:opacity-100 opacity-60"
          style={{ color: 'var(--text-secondary, rgba(255,255,255,0.5))' }}
        >
          Biblioteca
        </Link>
        <span className="opacity-30">/</span>
        <span style={{ color: 'var(--text-primary, #fff)' }}>Radio</span>
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
              <circle cx="12" cy="12" r="2" />
              <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
              <path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2" />
            </svg>
          </div>
          <div className="pb-1 space-y-1 min-w-0">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--accent, #6ee29e)' }}>
              Retransmisión Web
            </p>
            <h1 className="text-2xl sm:text-[28px] font-bold leading-tight truncate" style={{ color: 'var(--text-primary, #fff)' }}>
              Estaciones de Radio
            </h1>
            {!loading && stations.length > 0 && (
              <p className="text-sm" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.45))' }}>
                <span style={{ color: 'var(--text-primary, #fff)' }}>
                  {filteredStations.length} estaciones
                </span>
                <span style={{ color: 'var(--text-muted, rgba(255,255,255,0.25))' }}>
                  {' · '}Online y locales
                </span>
              </p>
            )}
          </div>
        </div>

        {!loading && stations.length > 0 && (
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
                placeholder="Buscar estación..."
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
                    Nueva estación
                  </button>
                  <button
                    onClick={handleValidate}
                    disabled={isValidating}
                    className="w-full text-left px-4 py-2.5 text-sm transition hover:bg-white/5 disabled:opacity-50 flex items-center gap-2"
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
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {isValidating ? 'Validando...' : 'Validar estaciones'}
                  </button>
                  <button
                    onClick={handleExport}
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Exportar
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Importar
                  </button>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
          </div>
        )}
      </div>

      {!loading && stations.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map(cat => {
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
        <StationGridSkeleton />
      ) : stations.length === 0 ? (
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
          <span className="text-4xl mb-3 block opacity-40 select-none">📡</span>
          <p className="text-sm" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            No hay estaciones de radio configuradas
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
            ➕ Agregar tu primera estación
          </button>
        </div>
      ) : filteredStations.length === 0 ? (
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            No se encontraron estaciones para "{searchQuery}"
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredStations.map((station) => {
              const isCurrent = currentStation?.id === station.id;
              const isActive = isCurrent && isRadioPlaying;

              return (
                <div
                  key={station.id}
                  className="group relative rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden border bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--accent)]/50"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(110,226,158,0.1),transparent_70%)]" />

                  <div className="absolute top-4 right-4 z-20">
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === Number(station.id) ? null : Number(station.id)); }}
                      className="w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center text-sm font-bold hover:bg-white/10 backdrop-blur-sm text-[var(--text-muted)]"
                    >
                      ⋮
                    </button>
                    {openMenuId === Number(station.id) && (
                      <div className="absolute right-0 mt-1 w-28 rounded-lg overflow-hidden z-30 animate-fadeIn bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl">
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingStation(station); setIsModalOpen(true); setOpenMenuId(null); }}
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
                          onClick={(e) => { e.stopPropagation(); requestDelete(Number(station.id), station.name); setOpenMenuId(null); }}
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
                      onClick={(e) => { e.stopPropagation(); isCurrent ? toggleRadio() : handleRadioAction(station); }}
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
                      text={station.name}
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
                      {station.categories?.split(',').map((tag, idx) => (
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
              {filteredStations.length} resultado{filteredStations.length !== 1 ? 's' : ''} para "{searchQuery}"
            </p>
          )}
        </>
      )}

      <StationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingStation(null); }}
        onSave={handleSave}
        initialData={editingStation}
      />
    </div>
  );
}