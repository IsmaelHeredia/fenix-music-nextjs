import { SqliteCustomPlaylistRepository } from '@/modules/custom-playlists/infrastructure/SqliteCustomPlaylistRepository';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const repo = new SqliteCustomPlaylistRepository();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const data = await repo.findById(Number(id));
    return Response.json(data);
  }

  const all = await repo.findAll();
  return Response.json(all);
}

export async function POST(req: Request) {
  try {
    const { name, songIds, id } = await req.json();

    const items = songIds.map((songId: number, index: number) => ({
      songId,
      order: index
    }));

    const playlistId = await repo.save(name, items, id);

    return Response.json({ success: true, playlistId }, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Fallo al guardar' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return Response.json({ error: 'ID requerido' }, { status: 400 });

  await repo.delete(Number(id));
  return Response.json({ success: true });
}