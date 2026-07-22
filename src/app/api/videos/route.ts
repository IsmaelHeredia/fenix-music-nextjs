import { NextResponse } from 'next/server';
import { GetAllVideos } from '@/modules/videos/application/GetAllVideos';
import { SqliteVideoRepository } from '@/modules/videos/infrastructure/SqliteVideoRepository';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const repository = new SqliteVideoRepository();
    const useCase = new GetAllVideos(repository);

    const videos = useCase.execute();

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error al obtener videos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los videos' },
      { status: 500 }
    );
  }
}