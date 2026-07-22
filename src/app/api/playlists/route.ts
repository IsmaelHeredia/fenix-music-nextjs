import { NextResponse } from 'next/server';
import { GetAllPlaylists } from '@/modules/playlists/application/GetAllPlaylists';
import { SqlitePlaylistRepository } from '@/modules/playlists/infrastructure/SqlitePlaylistRepository';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const repository = new SqlitePlaylistRepository();
    const useCase = new GetAllPlaylists(repository);

    const playlistsData = useCase.execute();

    return NextResponse.json(playlistsData);
  } catch (error) {
    console.error('Error al obtener playlists:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}