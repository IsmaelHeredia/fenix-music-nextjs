import { NextRequest, NextResponse } from 'next/server';
import { SqlitePlaylistRepository } from '@/modules/playlists/infrastructure/SqlitePlaylistRepository';
import { SqliteTrackRepository } from '@/modules/tracks/infrastructure/SqliteTrackRepository';
import { GetPlaylistById, PlaylistNotFoundError } from '@/modules/playlists/application/GetPlaylistById';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const playlistId = Number(id);

    if (isNaN(playlistId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    const playlistRepo = new SqlitePlaylistRepository();
    const trackRepo = new SqliteTrackRepository();
    const useCase = new GetPlaylistById(playlistRepo, trackRepo);

    const result = useCase.execute(playlistId);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof PlaylistNotFoundError) {
      return NextResponse.json({ error: 'Playlist no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}