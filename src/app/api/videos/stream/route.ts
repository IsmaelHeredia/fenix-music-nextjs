import { NextRequest, NextResponse } from 'next/server';
import { SqliteVideoRepository } from '@/modules/videos/infrastructure/SqliteVideoRepository';
import { GetVideoStream } from '@/modules/videos/application/GetVideoStream';
import { nodeStreamToWeb } from '@/modules/shared/infrastructure/stream-utils';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const id = Number(req.nextUrl.searchParams.get('id'));
    const useCase = new GetVideoStream(new SqliteVideoRepository());
    const { absolutePath, stats } = useCase.execute(id);

    const range = req.headers.get('range');
    const fileSize = stats.size;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(absolutePath, { start, end });

      return new NextResponse(nodeStreamToWeb(file), {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': 'video/mp4',
        },
      });
    }

    return new NextResponse(nodeStreamToWeb(fs.createReadStream(absolutePath)), {
      headers: { 'Content-Length': fileSize.toString(), 'Content-Type': 'video/mp4' },
    });
  } catch (err) {
    return new NextResponse((err as Error).message, { status: 500 });
  }
}