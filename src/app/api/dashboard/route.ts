import { NextResponse } from 'next/server';
import { GetDashboardStats } from '@/modules/dashboard';
import { SqliteTrackRepository } from '@/modules/tracks/infrastructure/SqliteTrackRepository';
import { SqlitePlaylistRepository } from '@/modules/playlists/infrastructure/SqlitePlaylistRepository';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const statsService = new GetDashboardStats(
      new SqliteTrackRepository(),
      new SqlitePlaylistRepository()
    );

    return NextResponse.json(statsService.execute());
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}