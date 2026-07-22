'use client';

import { useState, useEffect } from 'react';

interface StationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function StationModal({ isOpen, onClose, onSave, initialData }: StationModalProps) {
  const [formData, setFormData] = useState({ name: '', link: '', categories: '', position: 0 });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ name: '', link: '', categories: '', position: 0 });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}>
      <div
        className="w-full max-w-md p-5 sm:p-6 rounded-2xl animate-fadeIn relative overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
        }}
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-5" style={{ background: 'var(--accent)' }} />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full opacity-5" style={{ background: 'var(--accent)' }} />

        <div className="relative z-10 flex items-center gap-3 mb-6">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shrink-0"
            style={{
              background: 'var(--tag-bg)',
              border: '1px solid var(--tag-border)',
            }}
          >
            {initialData ? (
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                <circle cx="12" cy="12" r="2" />
                <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                <path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2" />
              </svg>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              {initialData ? 'Editar Estación' : 'Nueva Estación'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {initialData ? 'Actualiza los datos de la estación' : 'Agrega una nueva estación de radio'}
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div>
            <label
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wider flex items-center gap-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Nombre de la radio
            </label>
            <input
              type="text"
              placeholder="Ej: Radio Continental"
              className="w-full px-4 py-2.5 rounded-xl text-[15px] outline-none transition-all duration-200 focus:scale-[1.01]"
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wider flex items-center gap-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                <circle cx="12" cy="12" r="2" />
                <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                <path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2" />
              </svg>
              URL del stream
            </label>
            <input
              type="text"
              placeholder="https://ejemplo.com/stream.mp3"
              className="w-full px-4 py-2.5 rounded-xl text-[15px] outline-none transition-all duration-200 focus:scale-[1.01] font-mono"
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
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wider flex items-center gap-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              Categorías
            </label>
            <input
              type="text"
              placeholder="Rock, Pop, Noticias (separadas por coma)"
              className="w-full px-4 py-2.5 rounded-xl text-[15px] outline-none transition-all duration-200 focus:scale-[1.01]"
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
              value={formData.categories}
              onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
            />
          </div>
        </div>

        <div className="relative z-10 flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => { onSave(formData); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              background: 'var(--btn-action-bg)',
              color: 'var(--btn-action-text)',
              boxShadow: '0 4px 15px var(--accent-glow)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--btn-action-bg-hover)';
              e.currentTarget.style.boxShadow = '0 6px 25px var(--accent-glow)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--btn-action-bg)';
              e.currentTarget.style.boxShadow = '0 4px 15px var(--accent-glow)';
            }}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}