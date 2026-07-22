import { NextResponse } from 'next/server';
import { SqliteStationRepository } from '@/modules/stations/infrastructure/SqliteStationRepository';
import { ValidateStations } from '@/modules/stations/application/ValidateStations';
import { DeleteBrokenStations } from '@/modules/stations/application/DeleteBrokenStations';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const repository = new SqliteStationRepository();

export async function GET() {
  try {
    const useCase = new ValidateStations(repository);
    const broken = await useCase.execute();
    return NextResponse.json({ broken });
  } catch (error) {
    return NextResponse.json({ error: 'Error validando estaciones' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const useCase = new DeleteBrokenStations(repository);
    const count = await useCase.execute();
    return NextResponse.json({
      message: `Se eliminaron ${count} estaciones fallidas`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error eliminando estaciones' }, { status: 500 });
  }
}