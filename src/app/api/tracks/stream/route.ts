import { NextRequest, NextResponse } from 'next/server';
import { GetTrackStream } from '@/modules/tracks/application/GetTrackStream';
import fs from 'fs';
import { computeAndSaveWaveform } from '@/modules/shared/infrastructure/waveform-helper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const trackId = Number(req.nextUrl.searchParams.get('id'));
    if (!trackId) return new NextResponse('ID requerido', { status: 400 });

    const getStream = new GetTrackStream();
    const { absolutePath, waveform } = getStream.execute(trackId);

    if (!waveform) {
      computeAndSaveWaveform(absolutePath, trackId);
    }

    const stat = fs.statSync(absolutePath);
    const nodeStream = fs.createReadStream(absolutePath);

    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      },
      cancel() { nodeStream.destroy(); }
    });

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size.toString(),
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (err) {
    const status = (err as Error).message === 'NOT_FOUND' || 'FILE_MISSING' ? 404 : 500;
    return new NextResponse((err as Error).message, { status });
  }
}