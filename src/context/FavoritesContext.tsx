'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'react-toastify';

interface FavoritesContextType {
  favorites: Set<string | number>;
  toggleFavorite: (id: string | number, currentStatus?: boolean) => Promise<boolean>;
  isFavorite: (id: string | number) => boolean;
  syncFavorites: (tracks: Array<{ id: string | number; isFavorite?: boolean }>) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());

  const syncFavorites = useCallback((tracks: Array<{ id: string | number; isFavorite?: boolean }>) => {
    const newFavorites = new Set<string | number>();
    tracks.forEach(track => {
      if (track.isFavorite) {
        newFavorites.add(track.id);
      }
    });
    setFavorites(newFavorites);
  }, []);

  const toggleFavorite = useCallback(async (id: string | number, currentStatus?: boolean) => {
    const newStatus = currentStatus !== undefined ? !currentStatus : !favorites.has(id);
    
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newStatus) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });

    try {
      await fetch(`/api/tracks/${id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: newStatus }),
      });
      toast.success(newStatus ? 'Añadido a favoritos' : 'Eliminado de favoritos');
      return newStatus;
    } catch (err) {
      setFavorites(prev => {
        const newSet = new Set(prev);
        if (newStatus) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
      console.error('Error al guardar favorito:', err);
      toast.error('Error al guardar favorito');
      return !newStatus;
    }
  }, [favorites]);

  const isFavorite = useCallback((id: string | number) => {
    return favorites.has(id);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, syncFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}