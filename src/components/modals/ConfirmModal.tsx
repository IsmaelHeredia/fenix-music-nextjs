interface ConfirmModalProps {
  name: string;
  title?: string;
  itemLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ name, title, itemLabel = 'lista', onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onCancel}
    >
      <div
        className="rounded-2xl p-5 sm:p-6 w-full max-w-sm mx-auto space-y-5 relative overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10" style={{ background: 'var(--accent)' }} />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-5" style={{ background: 'var(--accent)' }} />

        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
              </svg>
            </div>
          </div>

          <p className="text-lg font-bold text-center break-words" style={{ color: 'var(--text-primary)' }}>
            {title ?? `Eliminar ${itemLabel}`}
          </p>

          <p className="text-sm text-center mt-2 leading-relaxed break-words" style={{ color: 'var(--text-secondary)' }}>
            ¿Seguro que querés eliminar {itemLabel}{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>"{name}"</span>?
            <br />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Esta acción no se puede deshacer.</span>
          </p>
        </div>

        <div className="relative z-10 flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
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
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(239,68,68,0.4)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}