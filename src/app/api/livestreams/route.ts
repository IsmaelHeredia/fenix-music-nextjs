import { NextRequest, NextResponse } from 'next/server';
import { SqliteLiveStreamRepository } from '@/modules/livestreams/infrastructure/SqliteLiveStreamRepository';
import { GetAllLiveStreams } from '@/modules/livestreams/application/GetAllLiveStreams';
import { CreateLiveStream } from '@/modules/livestreams/application/CreateLiveStream';
import { UpdateLiveStream } from '@/modules/livestreams/application/UpdateLiveStream';
import { DeleteLiveStream } from '@/modules/livestreams/application/DeleteLiveStream';
import { ImportLiveStreams } from '@/modules/livestreams/application/ImportLiveStreams';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const repo = new SqliteLiveStreamRepository();

const getAllService = new GetAllLiveStreams(repo);
const createService = new CreateLiveStream(repo);
const updateService = new UpdateLiveStream(repo);
const deleteService = new DeleteLiveStream(repo);
const importService = new ImportLiveStreams(repo);

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
      await importService.execute(data);
      return NextResponse.json({ success: true, message: 'Importación realizada' });
    }

    const created = await createService.execute(data);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const updated = await updateService.execute(data);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const success = await deleteService.execute(id);
    return NextResponse.json({ success });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}