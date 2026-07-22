'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

import { Tab, EnrichedPlaylist, SelectedIds, DeleteTarget } from './playlist.type';
import { formatDuration, parseDurationString, moveArray } from './playlist.helpers';
import { MyListsSkeleton, LibrarySkeleton, EditorSkeleton } from '@/components/skeletons/custom-playlists/CustomPlaylistSkeletons';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { SongOrderRow } from './SongOrderRow';

const IconList = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2z" /></svg>;
const IconLibrary = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 14.5l5.5-3.5L10 7.5v7z" /></svg>;
const IconEdit = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>;

const TABS: { key: Tab; label: string; icon: JSX.Element }[] = [
  { key: 'my-lists', label: 'Mis listas', icon: <IconList /> },
  { key: 'library', label: 'Biblioteca', icon: <IconLibrary /> },
  { key: 'editor', label: 'Editor', icon: <IconEdit /> },
];

export default function PlaylistsPage() {

  useEffect(() => {
    document.title = 'Listas personalizadas';
  }, []);

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('my-lists');
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<{ playlists: any[]; songs: any[] }>({ playlists: [], songs: [] });
  const [enrichedCustomPlaylists, setEnrichedCustomPlaylists] = useState<EnrichedPlaylist[]>([]);

  const [selectedIds, setSelectedIds] = useState<SelectedIds>({ songs: [], playlists: [] });
  const [orderedSongs, setOrderedSongs] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [playlistName, setPlaylistName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);

  const [unsavedChanges, setUnsavedChanges] = useState<{
    editingId: number | null;
    editName: string;
    selectedIds: SelectedIds;
    orderedSongs: any[];
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [playlists, songs, custom] = await Promise.all([
        fetch('/api/playlists').then(r => r.json()),
        fetch('/api/tracks').then(r => r.json()),
        fetch('/api/custom-playlists').then(r => r.json()),
      ]);
      setData({ playlists, songs });

      const details = await Promise.all(
        custom.map((p: any) =>
          fetch(`/api/custom-playlists?id=${p.id}`).then(r => r.json()).catch(() => null)
        )
      );

      const enriched: EnrichedPlaylist[] = custom.map((p: any, i: number) => {
        const items: any[] = details[i]?.items ?? [];
        const totalSecs = items.reduce((acc: number, item: any) => acc + parseDurationString(item.durationString), 0);
        const enrichedItems = items.map((item: any) => {
          const song = songs.find((s: any) => s.id === item.songId);
          const originPlaylist = playlists.find((pl: any) => pl.id === song?.playlistId);
          return {
            ...item,
            title: song?.title ?? `Canción #${item.songId}`,
            playlistName: originPlaylist?.name ?? '',
            durationString: item.durationString ?? song?.durationString ?? null,
          };
        });
        return { ...p, songCount: items.length, totalDuration: formatDuration(totalSecs), items: enrichedItems };
      });
      setEnrichedCustomPlaylists(enriched);
    } catch (err) {
      console.error('[fetchData] error:', err);
      toast.error('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (activeTab === 'editor' && unsavedChanges) {
      setEditingId(unsavedChanges.editingId);
      setEditName(unsavedChanges.editName);
      setSelectedIds(unsavedChanges.selectedIds);
      setOrderedSongs(unsavedChanges.orderedSongs);
      if (unsavedChanges.editingId) {
        setSelectedPlaylistId(unsavedChanges.editingId);
      }
    }
  }, [activeTab, unsavedChanges]);

  useEffect(() => {
    const selected = data.songs.filter(s => selectedIds.songs.includes(s.id));
    setOrderedSongs(prev => {
      const kept = prev.filter(p => selectedIds.songs.includes(p.id));
      const added = selected.filter(s => !prev.find(p => p.id === s.id));
      return [...kept, ...added];
    });
  }, [selectedIds, data.songs]);

  const editorStats = useMemo(() => {
    const totalSecs = orderedSongs.reduce((acc, s) => acc + parseDurationString(s.durationString), 0);
    return { count: orderedSongs.length, duration: formatDuration(totalSecs) };
  }, [orderedSongs]);

  const getPlaylistName = (song: any) =>
    data.playlists.find(p => p.id === song.playlistId)?.name ?? '';

  const filteredPlaylists = useMemo(
    () => data.playlists.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [data.playlists, searchTerm]
  );

  const activeName = editingId !== null ? editName : playlistName;
  const setActiveName = editingId !== null ? setEditName : setPlaylistName;

  const openEdit = (p: EnrichedPlaylist) => {
    if (unsavedChanges && unsavedChanges.editingId === p.id) {
      setEditingId(unsavedChanges.editingId);
      setEditName(unsavedChanges.editName);
      setSelectedIds(unsavedChanges.selectedIds);
      setOrderedSongs(unsavedChanges.orderedSongs);
      setSelectedPlaylistId(p.id);
      setActiveTab('editor');
      return;
    }

    setSelectedPlaylistId(p.id);
    setEditingId(p.id);
    setEditName(p.name);
    setPlaylistName(p.name);

    const songIds = p.items.map(item => item.songId);
    const originPlaylistIds = Array.from(new Set(
      p.items.map(item => {
        const song = data.songs.find((s: any) => s.id === item.songId);
        return song?.playlistId ?? null;
      }).filter(Boolean)
    )) as number[];

    setSelectedIds({ playlists: originPlaylistIds, songs: songIds });

    const ordered = p.items
      .map(item => {
        const song = data.songs.find((s: any) => s.id === item.songId);
        return song ? { ...song, durationString: item.durationString ?? song.durationString } : null;
      })
      .filter(Boolean);

    setOrderedSongs(ordered);
    setActiveTab('editor');
  };

  const closeEdit = () => {
    if (editingId !== null && !isSaving) {
      setUnsavedChanges({
        editingId,
        editName,
        selectedIds,
        orderedSongs,
      });
    }

    setEditingId(null);
    setEditName('');
    setPlaylistName('');
    setSelectedIds({ songs: [], playlists: [] });
    setOrderedSongs([]);
    setExpandedRows([]);
    setSelectedPlaylistId(null);
  };

  const discardChanges = () => {
    setUnsavedChanges(null);
    setEditingId(null);
    setEditName('');
    setPlaylistName('');
    setSelectedIds({ songs: [], playlists: [] });
    setOrderedSongs([]);
    setExpandedRows([]);
    setSelectedPlaylistId(null);
    setActiveTab('my-lists');
    toast.info('Cambios descartados');
  };

  const handleSave = async () => {
    if (!activeName.trim()) return toast.error('Ingresá un nombre para la lista');
    if (orderedSongs.length === 0) return toast.error('Agregá al menos una canción');

    setIsSaving(true);
    try {
      const body: any = { name: activeName.trim(), songIds: orderedSongs.map(s => Number(s.id)) };
      if (editingId !== null) body.id = editingId;

      const res = await fetch('/api/custom-playlists', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const resBody = await res.json().catch(() => ({}));
        toast.error(`Error al guardar (${res.status}): ${resBody?.error ?? 'desconocido'}`);
        return;
      }

      toast.success(editingId !== null ? 'Lista actualizada' : 'Lista guardada correctamente');

      setUnsavedChanges(null);

      setEditingId(null);
      setEditName('');
      setPlaylistName('');
      setSelectedIds({ songs: [], playlists: [] });
      setOrderedSongs([]);
      setExpandedRows([]);

      setSelectedPlaylistId(null);

      await fetchData();

      setActiveTab('my-lists');
    } catch {
      toast.error('Error de red al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const requestDelete = (id: number, name: string) => setDeleteTarget({ id, name });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/custom-playlists?id=${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Error al eliminar la lista'); return; }
      toast.info('Lista eliminada');
      if (editingId === deleteTarget.id) {
        setEditingId(null);
        setEditName('');
        setPlaylistName('');
        setSelectedIds({ songs: [], playlists: [] });
        setOrderedSongs([]);
        setExpandedRows([]);
        setSelectedPlaylistId(null);
      }
      if (selectedPlaylistId === deleteTarget.id) setSelectedPlaylistId(null);
      if (unsavedChanges?.editingId === deleteTarget.id) setUnsavedChanges(null);
      await fetchData();
    } catch {
      toast.error('Error de red al eliminar');
    } finally {
      setDeleteTarget(null);
    }
  };

  const togglePlaylist = (p: any) => {
    const songsInPlaylist = data.songs.filter((s: any) => s.playlistId === p.id).map((s: any) => s.id);
    const isSelected = selectedIds.playlists.includes(p.id);

    setSelectedIds(prev => ({
      playlists: isSelected ? prev.playlists.filter(id => id !== p.id) : [...prev.playlists, p.id],
      songs: isSelected
        ? prev.songs.filter(id => !songsInPlaylist.includes(id))
        : Array.from(new Set([...prev.songs, ...songsInPlaylist])),
    }));

    if (unsavedChanges) {
      const updatedChanges = {
        ...unsavedChanges,
        selectedIds: {
          playlists: isSelected
            ? unsavedChanges.selectedIds.playlists.filter(id => id !== p.id)
            : [...unsavedChanges.selectedIds.playlists, p.id],
          songs: isSelected
            ? unsavedChanges.selectedIds.songs.filter(id => !songsInPlaylist.includes(id))
            : Array.from(new Set([...unsavedChanges.selectedIds.songs, ...songsInPlaylist])),
        }
      };
      setUnsavedChanges(updatedChanges);
    }
  };

  const toggleSong = (songId: number) => {
    setSelectedIds(prev => ({
      ...prev,
      songs: prev.songs.includes(songId)
        ? prev.songs.filter(id => id !== songId)
        : [...prev.songs, songId],
    }));

    if (unsavedChanges) {
      const updatedChanges = {
        ...unsavedChanges,
        selectedIds: {
          ...unsavedChanges.selectedIds,
          songs: unsavedChanges.selectedIds.songs.includes(songId)
            ? unsavedChanges.selectedIds.songs.filter(id => id !== songId)
            : [...unsavedChanges.selectedIds.songs, songId],
        }
      };
      setUnsavedChanges(updatedChanges);
    }
  };

  const toggleExpand = (id: number) =>
    setExpandedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const removeSong = (idx: number, songId: number) => {
    setOrderedSongs(prev => prev.filter((_, i) => i !== idx));
    setSelectedIds(prev => ({ ...prev, songs: prev.songs.filter(id => id !== songId) }));

    if (unsavedChanges) {
      const updatedChanges = {
        ...unsavedChanges,
        selectedIds: {
          ...unsavedChanges.selectedIds,
          songs: unsavedChanges.selectedIds.songs.filter(id => id !== songId),
        },
        orderedSongs: unsavedChanges.orderedSongs.filter((_, i) => i !== idx),
      };
      setUnsavedChanges(updatedChanges);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">
      {deleteTarget && (
        <ConfirmModal
          name={deleteTarget.name}
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
        <span style={{ color: 'var(--text-primary, #fff)' }}>Listas Personalizadas</span>
      </nav>

      <div className="flex items-end gap-4 sm:gap-5 mb-8 min-w-0">
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
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <div className="pb-1 space-y-1 min-w-0">
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--accent, #6ee29e)' }}>
            Organización
          </p>
          <h1 className="text-2xl sm:text-[28px] font-bold leading-tight truncate" style={{ color: 'var(--text-primary, #fff)' }}>
            Listas Personalizadas
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.45))' }}>
            Crea y edita tus propias listas de canciones
          </p>
        </div>
      </div>

      <div
        className="flex gap-[2px] rounded-xl p-1 mb-8"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              if (key === 'my-lists' && !unsavedChanges) {
                closeEdit();
              }
            }}
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 rounded-[10px] text-sm font-medium transition-all"
            style={{
              background: activeTab === key ? 'rgba(110,226,158,0.15)' : 'transparent',
              color: activeTab === key ? 'var(--accent, #6ee29e)' : 'var(--text-muted)',
              border: activeTab === key ? '1px solid var(--accent, #6ee29e)' : '1px solid transparent',
            }}
          >
            <span style={{ color: activeTab === key ? 'var(--accent, #6ee29e)' : 'var(--text-muted)' }}>
              {icon}
            </span>
            <span className="hidden sm:inline">{label}</span>
            {key === 'editor' && editingId !== null && (
              <span
                className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
                style={{ background: 'rgba(110,226,158,0.15)', color: 'var(--accent, #6ee29e)' }}
              >
                <span className="hidden sm:inline">editando</span>
                <span className="sm:hidden">●</span>
              </span>
            )}
            {key === 'my-lists' && unsavedChanges && (
              <span
                className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
                style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
              >
                <span className="hidden sm:inline">⚡ cambios sin guardar</span>
                <span className="sm:hidden">⚡</span>
              </span>
            )}
            {key === 'library' && unsavedChanges && (
              <span
                className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
                style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
              >
                ⚡
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'my-lists' && (
        isLoading ? <MyListsSkeleton /> : (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Mis listas</h2>
              <button
                onClick={() => {
                  if (unsavedChanges) {
                    setUnsavedChanges(null);
                    setSelectedIds({ songs: [], playlists: [] });
                    setOrderedSongs([]);
                    setEditingId(null);
                    setEditName('');
                    setPlaylistName('');
                    setSelectedPlaylistId(null);
                  }
                  setActiveTab('editor');
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-lg transition"
                style={{
                  background: 'var(--accent, #6ee29e)',
                  color: '#000',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                + Nueva lista
              </button>
            </div>

            {enrichedCustomPlaylists.length === 0 ? (
              <div
                className="py-24 text-center text-sm rounded-2xl"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}
              >
                <p className="mb-2">Aún no creaste ninguna lista</p>
                <button
                  onClick={() => { closeEdit(); setActiveTab('editor'); }}
                  className="underline underline-offset-2 transition"
                  style={{ color: 'var(--accent, #6ee29e)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-hover, #5cd08a)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--accent, #6ee29e)')}
                >
                  Crear la primera
                </button>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.1))' }}>
                {enrichedCustomPlaylists.map((p, i) => {
                  const hasUnsavedChanges = unsavedChanges?.editingId === p.id;
                  return (
                    <div
                      key={p.id}
                      className="group flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 transition-colors duration-200 hover:bg-[var(--row-hover-bg)] cursor-pointer"
                      style={{
                        borderBottom: i < enrichedCustomPlaylists.length - 1 ? '1px solid var(--border-color, rgba(255,255,255,0.04))' : 'none',
                      }}
                      onClick={() => openEdit(p)}
                    >
                      <span className="text-sm w-6 text-right select-none shrink-0 hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                        {i + 1}
                      </span>
                      <span className="flex-1 min-w-[120px] text-[15px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {p.name}
                        {hasUnsavedChanges && (
                          <span className="ml-2 text-xs" style={{ color: '#fbbf24' }}>⚡</span>
                        )}
                      </span>
                      <div className="hidden sm:flex items-center gap-3 shrink-0">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {p.songCount} {p.songCount === 1 ? 'canción' : 'canciones'}
                        </span>
                        {p.totalDuration && p.songCount > 0 && (
                          <>
                            <span style={{ color: 'var(--border-color)' }}>·</span>
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{p.totalDuration}</span>
                          </>
                        )}
                      </div>

                      {p.songCount > 0 && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            router.push(`/custom-playlists/player?id=${p.id}`);
                          }}
                          className="w-9 h-9 rounded-full flex items-center justify-center transition shrink-0"
                          style={{
                            background: 'rgba(110,226,158,0.1)',
                            color: 'var(--accent, #6ee29e)',
                            border: '1px solid var(--accent, #6ee29e)',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent, #6ee29e)';
                            (e.currentTarget as HTMLButtonElement).style.color = '#000';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(110,226,158,0.1)';
                            (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent, #6ee29e)';
                          }}
                          title="Reproducir lista"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.5 5v14l10-7z" />
                          </svg>
                        </button>
                      )}

                      <button
                        onClick={e => { e.stopPropagation(); openEdit(p); }}
                        className="text-sm transition px-3 sm:px-4 py-1.5 rounded-lg font-medium shrink-0"
                        style={{
                          color: 'var(--accent, #6ee29e)',
                          border: '1px solid var(--accent, #6ee29e)',
                          background: 'transparent',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(110,226,158,0.08)';
                          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-hover, #5cd08a)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent, #6ee29e)';
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); requestDelete(p.id, p.name); }}
                        className="text-sm transition px-3 sm:px-4 py-1.5 rounded-lg font-medium shrink-0"
                        style={{
                          color: 'rgba(239,68,68,0.6)',
                          border: '1px solid rgba(239,68,68,0.2)',
                          background: 'transparent',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.color = 'rgb(239,68,68)';
                          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
                          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.4)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(239,68,68,0.6)';
                          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.2)';
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )
      )}

      {activeTab === 'library' && (
        isLoading ? <LibrarySkeleton /> : (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {editingId !== null
                  ? <><span>Editando: </span><span style={{ color: 'var(--accent, #6ee29e)' }}>{editName}</span></>
                  : 'Biblioteca'}
                {unsavedChanges && (
                  <span className="ml-2 text-xs font-medium" style={{ color: '#fbbf24' }}>(cambios sin guardar)</span>
                )}
              </h2>
              {selectedIds.playlists.length > 0 && (
                <button
                  onClick={() => setActiveTab('editor')}
                  className="text-sm transition"
                  style={{ color: 'var(--accent, #6ee29e)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-hover, #5cd08a)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--accent, #6ee29e)')}
                >
                  {selectedIds.playlists.length} seleccionadas → Editor
                </button>
              )}
            </div>

            <div className="relative flex items-center">
              <span
                className="absolute left-3.5 select-none pointer-events-none flex items-center justify-center"
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
                placeholder="Buscar playlist..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl text-[15px] outline-none transition"
                style={{
                  background: 'var(--bg-card, rgba(255,255,255,0.05))',
                  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  color: 'var(--text-primary, #fff)',
                }}
              />
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.1))' }}>
              {filteredPlaylists.map((p, i) => {
                const plSongs = data.songs.filter((s: any) => s.playlistId === p.id);
                const isExpanded = expandedRows.includes(p.id);
                const isEditingThis = unsavedChanges !== null && unsavedChanges.editingId === p.id;
                const currentSelectedIds = isEditingThis ? unsavedChanges.selectedIds : selectedIds;
                const isChecked = currentSelectedIds.playlists.includes(p.id);
                const totalSecs = plSongs.reduce((acc: number, s: any) => acc + parseDurationString(s.durationString), 0);

                return (
                  <div
                    key={p.id}
                    style={{ borderBottom: i < filteredPlaylists.length - 1 ? '1px solid var(--border-color, rgba(255,255,255,0.04))' : 'none' }}
                  >
                    <div
                      className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 transition-colors duration-200 hover:bg-[var(--row-hover-bg)]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePlaylist(p)}
                        className="w-4 h-4 cursor-pointer shrink-0 rounded transition"
                        style={{
                          accentColor: 'var(--accent, #6ee29e)',
                          backgroundColor: isChecked ? 'var(--accent, #6ee29e)' : 'rgba(255,255,255,0.1)',
                        }}
                      />
                      <span
                        className="flex-1 min-w-[120px] text-[15px] cursor-pointer select-none truncate"
                        style={{ color: 'var(--text-primary)' }}
                        onClick={() => toggleExpand(p.id)}
                      >
                        {p.name}
                        {isEditingThis && (
                          <span className="ml-2 text-xs" style={{ color: '#fbbf24' }}>⚡</span>
                        )}
                      </span>
                      <div className="hidden sm:flex items-center gap-3 shrink-0">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {plSongs.length} canciones
                        </span>
                        {totalSecs > 0 && (
                          <>
                            <span style={{ color: 'var(--border-color)' }}>·</span>
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                              {formatDuration(totalSecs)}
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => toggleExpand(p.id)}
                        className="text-sm w-8 h-8 flex items-center justify-center rounded ml-1 transition shrink-0"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--accent, #6ee29e)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)')}
                        aria-label={isExpanded ? 'Contraer' : 'Expandir'}
                      >
                        {isExpanded ? '▲' : '▼'}
                      </button>
                    </div>

                    {isExpanded && plSongs.length > 0 && (
                      <div style={{ borderTop: '1px solid var(--border-color, rgba(255,255,255,0.04))', background: 'var(--bg-card)' }}>
                        {plSongs.map((s: any, si: number) => {
                          const isSongChecked = currentSelectedIds.songs.includes(s.id);
                          return (
                            <div
                              key={s.id}
                              className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 transition-colors duration-200 hover:bg-[var(--row-hover-bg)]"
                              style={{ borderBottom: si < plSongs.length - 1 ? '1px solid var(--border-color, rgba(255,255,255,0.04))' : 'none' }}
                            >
                              <span className="w-4 shrink-0" />
                              <input
                                type="checkbox"
                                checked={isSongChecked}
                                onChange={() => toggleSong(s.id)}
                                className="w-4 h-4 cursor-pointer shrink-0 rounded transition"
                                style={{
                                  accentColor: 'var(--accent, #6ee29e)',
                                  backgroundColor: isSongChecked ? 'var(--accent, #6ee29e)' : 'rgba(255,255,255,0.1)',
                                }}
                              />
                              <span className="text-sm w-6 text-right select-none shrink-0 hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                                {si + 1}
                              </span>
                              <span className="flex-1 min-w-0 text-[15px] truncate" style={{ color: 'var(--text-primary)' }}>{s.title}</span>
                              {s.durationString && (
                                <span className="text-sm font-medium shrink-0" style={{ color: 'var(--text-secondary, rgba(255,255,255,0.5))' }}>
                                  {s.durationString}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {activeTab === 'editor' && (
        isLoading ? <EditorSkeleton /> : (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <h2 className="text-base font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {editingId !== null
                    ? <><span>Editando: </span><span style={{ color: 'var(--accent, #6ee29e)' }}>{editName}</span></>
                    : 'Editor'}
                  {editingId !== null && unsavedChanges?.editingId === editingId && (
                    <span className="ml-2 text-xs font-medium" style={{ color: '#fbbf24' }}>(sin guardar)</span>
                  )}
                </h2>
              </div>
              <div className="flex gap-2 flex-wrap">
                {editingId !== null && (
                  <button
                    onClick={() => {
                      const pl = enrichedCustomPlaylists.find(p => p.id === editingId);
                      if (pl) requestDelete(pl.id, pl.name);
                    }}
                    className="text-sm transition px-4 py-1.5 rounded-lg font-medium"
                    style={{
                      color: 'rgba(239,68,68,0.6)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      background: 'transparent',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgb(239,68,68)';
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.4)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgba(239,68,68,0.6)';
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.2)';
                    }}
                  >
                    Eliminar lista
                  </button>
                )}
                <button
                  onClick={discardChanges}
                  className="text-sm transition px-4 py-1.5 rounded-lg font-medium"
                  style={{
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.15))',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgb(239,68,68)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.4)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.05)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-color, rgba(255,255,255,0.15))';
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  Descartar cambios
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                {editingId !== null ? 'Nombre' : 'Nombre de la lista'}
              </label>
              <input
                placeholder={editingId !== null ? '' : 'Ej: Tarde de verano…'}
                value={activeName}
                onChange={e => setActiveName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl text-[15px] outline-none transition"
                style={{
                  background: 'var(--bg-card, rgba(255,255,255,0.05))',
                  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  color: 'var(--text-primary, #fff)',
                }}
              />
            </div>

            <div>
              <button
                onClick={() => setActiveTab('library')}
                className="text-sm transition flex items-center gap-1.5"
                style={{ color: 'var(--accent, #6ee29e)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-hover, #5cd08a)')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--accent, #6ee29e)')}
              >
                ＋ Agregar canciones desde la Biblioteca
              </button>
            </div>

            {orderedSongs.length > 0 && (
              <div
                className="flex items-center gap-6 px-5 py-3 rounded-xl overflow-x-auto"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color, rgba(255,255,255,0.1))' }}
              >
                <div className="shrink-0">
                  <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Canciones</p>
                  <p className="text-[15px] font-medium" style={{ color: 'var(--text-primary)' }}>{editorStats.count}</p>
                </div>
                <div className="w-px h-8 shrink-0" style={{ background: 'var(--border-color)' }} />
                <div className="shrink-0">
                  <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Duración total</p>
                  <p className="text-[15px] font-medium" style={{ color: 'var(--text-primary)' }}>{editorStats.duration}</p>
                </div>
              </div>
            )}

            {orderedSongs.length > 0 ? (
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Canciones</label>
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.1))' }}>
                  {orderedSongs.map((s, idx) => (
                    <SongOrderRow
                      key={s.id}
                      index={idx}
                      title={s.title}
                      playlistName={getPlaylistName(s)}
                      durationString={s.durationString}
                      isLast={idx === orderedSongs.length - 1}
                      onMove={action => setOrderedSongs(prev => moveArray(prev, idx, action))}
                      onRemove={() => removeSong(idx, s.id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="py-12 text-center text-sm rounded-2xl"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color, rgba(255,255,255,0.06))' }}
              >
                Seleccioná playlists en la Biblioteca para agregar canciones
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { closeEdit(); setActiveTab('my-lists'); }}
                className="flex-1 h-12 text-[15px] font-medium rounded-xl transition"
                style={{
                  border: '1px solid var(--border-color, rgba(255,255,255,0.15))',
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-color, rgba(255,255,255,0.15))';
                }}
              >
                {editingId !== null ? 'Cancelar' : 'Volver'}
              </button>
              <button
                onClick={handleSave}
                disabled={!activeName.trim() || orderedSongs.length === 0 || isSaving}
                className="flex-1 h-12 text-[15px] font-medium rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--accent, #6ee29e)',
                  color: '#000',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                {isSaving ? 'Guardando…' : editingId !== null ? 'Guardar cambios' : 'Guardar lista'}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}