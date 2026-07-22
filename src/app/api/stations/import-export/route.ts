import { NextRequest, NextResponse } from 'next/server';
import { SqliteStationRepository } from '@/modules/stations/infrastructure/SqliteStationRepository';
import { CreateStation, DeleteStation, GetAllStations, ImportStations, UpdateStation } from '@/modules/stations';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const repo = new SqliteStationRepository();

const getAllService = new GetAllStations(repo);
const importService = new ImportStations(repo);
const createService = new CreateStation(repo);
const updateService = new UpdateStation(repo);
const deleteService = new DeleteStation(repo);

export async function GET() {
  try {
    const data = await getAllService.execute();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (Array.isArray(data)) {
      const result = await importService.execute(data);
      return NextResponse.json(result);
    }
    const result = await createService.execute(data);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await updateService.execute(data);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    const success = await deleteService.execute(id);
    return NextResponse.json({ success });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}