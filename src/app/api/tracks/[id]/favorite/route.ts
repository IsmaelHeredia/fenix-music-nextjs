import { NextResponse } from 'next/server';
import { SqliteTrackRepository } from '@/modules/tracks/infrastructure/SqliteTrackRepository';
import { ToggleFavoriteTrack, TrackNotFoundError } from '@/modules/tracks/application/ToggleFavoriteTrack';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteParams {
  params: { id: string };
}

export async function PATCH(_request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    const repository = new SqliteTrackRepository();
    const useCase = new ToggleFavoriteTrack(repository);

    const updatedTrack = useCase.execute(id);

    return NextResponse.json({ success: true, track: updatedTrack });
  } catch (error) {
    if (error instanceof TrackNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}