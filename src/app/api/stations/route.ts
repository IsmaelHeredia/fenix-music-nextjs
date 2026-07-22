import { NextRequest, NextResponse } from 'next/server';
import { SqliteStationRepository } from '@/modules/stations/infrastructure/SqliteStationRepository';
import { GetAllStations, CreateStation, DeleteStation, ImportStations, UpdateStation } from '@/modules/stations';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const repo = new SqliteStationRepository();

const getAllService = new GetAllStations(repo);
const createService = new CreateStation(repo);
const updateService = new UpdateStation(repo);
const deleteService = new DeleteStation(repo);
const importService = new ImportStations(repo);

export async function GET() {
  const stations = await getAllService.execute();
  return NextResponse.json(stations);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (Array.isArray(data)) {
      await importService.execute(data);
      return NextResponse.json({ success: true });
    }

    const newStation = await createService.execute(data);
    return NextResponse.json(newStation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const updated = await updateService.execute(data);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const success = await deleteService.execute(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Error al borrar' }, { status: 500 });
  }
}