export function AboutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div
        className="w-full max-w-md p-5 sm:p-6 rounded-2xl animate-fadeIn max-h-[90vh] overflow-y-auto"
        style={{
          background: 'var(--bg-card, #1e1e1e)',
          border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-center gap-3 mb-6 min-w-0">
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
          >
            <img
              src="/logo-fenix.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate" style={{ color: 'var(--text-primary, #fff)' }}>FENIX MUSIC</h2>
            <p className="text-xs" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.5))' }}>Tu centro multimedia local</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted, rgba(255,255,255,0.4))' }}>Versión</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-primary, #fff)' }}>1.0</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted, rgba(255,255,255,0.4))' }}>Autor</p>
              <p className="text-sm mt-1 truncate" style={{ color: 'var(--text-primary, #fff)' }}>Ismael Heredia</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted, rgba(255,255,255,0.4))' }}>Descripción</p>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.7))' }}>
              Fenix Music es un reproductor multimedia local completo que te permite gestionar y disfrutar de toda tu biblioteca de música, videos y radio en un solo lugar. Con una interfaz moderna y personalizable, ofrece una experiencia de entretenimiento sin interrupciones.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted, rgba(255,255,255,0.4))' }}>Características</p>
            <ul className="text-sm mt-2 space-y-1" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.6))' }}>
              <li>✓ Reproducción de audio local sin conexión</li>
              <li>✓ Playlists personalizadas y favoritos</li>
              <li>✓ Estaciones de radio integradas</li>
              <li>✓ Videos y streams en vivo</li>
              <li>✓ Tema claro/oscuro automático</li>
              <li>✓ Biblioteca inteligente con búsqueda avanzada</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t text-center text-xs" style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.06))', color: 'var(--text-muted, rgba(255,255,255,0.3))' }}>
          <p>© 2026 Fenix Music · Tu biblioteca, tu control</p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
            style={{
              background: 'var(--accent, #6ee29e)',
              color: '#000',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}