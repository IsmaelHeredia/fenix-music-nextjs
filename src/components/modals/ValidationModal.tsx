import { RadioStationItem } from "@/context/RadioPlayerContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokenStations: RadioStationItem[];
  onConfirmDelete: (ids: number[]) => Promise<void>;
  isLoading: boolean;
}

export function ValidationModal({ isOpen, onClose, brokenStations, onConfirmDelete, isLoading }: ValidationModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen) {
      const numericIds = brokenStations
        .map(s => typeof s.id === 'number' ? s.id : null)
        .filter((id): id is number => id !== null);
      setSelectedIds(new Set(numericIds));
    }
  }, [isOpen, brokenStations]);

  if (!isOpen) return null;

  const numericBrokenStations = brokenStations.filter(s => typeof s.id === 'number') as (RadioStationItem & { id: number })[];

  const toggleAll = () => {
    if (selectedIds.size === numericBrokenStations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(numericBrokenStations.map(s => s.id)));
    }
  };

  const toggleStation = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) {
      toast.warning('No seleccionaste ninguna estación para eliminar');
      return;
    }
    onConfirmDelete(Array.from(selectedIds));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}>
      <div
        className="w-full max-w-2xl p-5 sm:p-6 rounded-2xl animate-fadeIn relative overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{
          background: 'var(--bg-card, #1e1e1e)',
          border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
        }}
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-5" style={{ background: '#ef4444' }} />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full opacity-5" style={{ background: '#ef4444' }} />

        <div className="relative z-10 flex items-center gap-3 sm:gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 4px 15px rgba(239,68,68,0.3)',
            }}
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate" style={{ color: 'var(--text-primary, #fff)' }}>
              Estaciones fallidas
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.5))' }}>
              {numericBrokenStations.length} estaciones no responden correctamente
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap mb-4">
          <button
            onClick={toggleAll}
            className="text-xs font-medium transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{
              color: 'var(--accent, #6ee29e)',
              border: '1px solid var(--accent, #6ee29e)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(110,226,158,0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {selectedIds.size === numericBrokenStations.length ? (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Deseleccionar todo
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Seleccionar todo
              </>
            )}
          </button>
          <span className="text-xs" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
            {selectedIds.size} seleccionadas
          </span>
        </div>

        <div className="relative z-10 max-h-96 overflow-y-auto space-y-1.5 mb-6 rounded-xl p-1" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}>
          {numericBrokenStations.map((station) => (
            <label
              key={station.id}
              className={`flex flex-wrap items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
                selectedIds.has(station.id) ? 'bg-white/[0.06] border border-[var(--accent)]/20' : 'hover:bg-white/5'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(station.id)}
                onChange={() => toggleStation(station.id)}
                className="w-4 h-4 cursor-pointer shrink-0 rounded"
                style={{ accentColor: 'var(--accent, #6ee29e)' }}
              />
              <div className="flex-1 min-w-[140px]">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary, #fff)' }}>
                  {station.name}
                </p>
                <p className="text-xs truncate mt-0.5 font-mono" style={{ color: 'var(--text-muted, rgba(255,255,255,0.4))' }}>
                  {station.link}
                </p>
              </div>
              <div className="flex flex-wrap gap-1 shrink-0 ml-7 sm:ml-0">
                {station.categories?.split(',').slice(0, 2).map((cat, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(239,68,68,0.12)',
                      border: '1px solid rgba(239,68,68,0.15)',
                      color: '#f87171',
                    }}
                  >
                    {cat.trim()}
                  </span>
                ))}
              </div>
            </label>
          ))}
        </div>

        <div className="relative z-10 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
              color: 'var(--text-secondary, rgba(255,255,255,0.5))',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.color = 'var(--text-primary, #fff)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border-color, rgba(255,255,255,0.1))';
              e.currentTarget.style.color = 'var(--text-secondary, rgba(255,255,255,0.5))';
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading || selectedIds.size === 0}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(239,68,68,0.25)',
            }}
            onMouseEnter={e => {
              if (!isLoading && selectedIds.size > 0) {
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(239,68,68,0.4)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(239,68,68,0.25)';
            }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Eliminar ({selectedIds.size})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}