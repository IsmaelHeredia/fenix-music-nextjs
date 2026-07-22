import { NextResponse } from 'next/server';
import { SyncLibrary } from '@/modules/settings/application/SyncLibrary';
import { SqliteSettingRepository } from '@/modules/settings/infrastructure/SqliteSettingRepository';
import { SqliteTrackRepository } from '@/modules/tracks/infrastructure/SqliteTrackRepository';
import { SqlitePlaylistRepository } from '@/modules/playlists/infrastructure/SqlitePlaylistRepository';
import { SqliteVideoRepository } from '@/modules/videos/infrastructure/SqliteVideoRepository';
import { MusicScanner } from '@/modules/tracks/infrastructure/MusicScanner';
import { VideoScanner } from '@/modules/videos/infrastructure/VideoScanner';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const repo = new SqliteSettingRepository();

    const music_directory = repo.get('music_directory') || '';
    const video_directory = repo.get('video_directory') || '';

    return NextResponse.json({
      music_directory,
      video_directory
    });
  } catch (error) {
    console.error("Error al obtener settings:", error);
    return NextResponse.json({ error: 'Error al cargar ajustes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  const syncService = new SyncLibrary(
    new SqliteSettingRepository(),
    new MusicScanner(new SqliteTrackRepository(), new SqlitePlaylistRepository()),
    new VideoScanner(new SqliteVideoRepository())
  );

  const result = await syncService.execute(
    body.music_directory,
    body.video_directory,
    body.trigger_scan
  );

  return NextResponse.json(result);
}