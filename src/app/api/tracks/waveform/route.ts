import { NextResponse, NextRequest } from 'next/server';
import { GetTrackWaveform } from '@/modules/tracks/application/GetTrackWaveform';
import { SqliteTrackRepository } from '@/modules/tracks/infrastructure/SqliteTrackRepository';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));

  if (!id) return new NextResponse('Missing id', { status: 400 });

  const useCase = new GetTrackWaveform(new SqliteTrackRepository());
  const waveform = useCase.execute(id);

  return NextResponse.json({ waveform });
}