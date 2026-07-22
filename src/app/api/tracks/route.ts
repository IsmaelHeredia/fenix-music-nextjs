import { NextResponse } from 'next/server';
import { SqliteTrackRepository } from '@/modules/tracks/infrastructure/SqliteTrackRepository';
import { GetAllTracks } from '@/modules/tracks/application/GetAllTracks';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const favorites = searchParams.get('favorites') === 'true';

    const repository = new SqliteTrackRepository();
    const getAllTracks = new GetAllTracks(repository);

    const tracks = getAllTracks.execute(favorites);

    return NextResponse.json(tracks);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}