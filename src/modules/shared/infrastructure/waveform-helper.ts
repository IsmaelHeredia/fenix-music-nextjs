import { execFile } from 'child_process';
import { getDb } from '@/modules/shared/infrastructure/sqlite-client';
import { songs } from '@/modules/shared/db/schema';
import { eq } from 'drizzle-orm';

export function computeAndSaveWaveform(absolutePath: string, songId: number): void {
  execFile(
    'ffmpeg',
    ['-i', absolutePath, '-vn', '-ac', '1', '-ar', '8000', '-f', 's16le', 'pipe:1'],
    { encoding: 'buffer', maxBuffer: 50 * 1024 * 1024 },
    (err, stdout) => {
      if (err || !stdout) return;
      
      try {
        const buffer = stdout as Buffer;
        const targetPoints = 60;
        const totalSamples = Math.floor(buffer.length / 2);
        const blockSize = Math.floor(totalSamples / targetPoints);
        if (blockSize === 0) return;

        let globalMax = 0;
        const peaks: number[] = [];

        for (let i = 0; i < targetPoints; i++) {
          let maxVal = 0;
          for (let j = 0; j < blockSize; j++) {
            const offset = (i * blockSize + j) * 2;
            if (offset + 1 < buffer.length) {
              const sample = Math.abs(buffer.readInt16LE(offset));
              if (sample > maxVal) maxVal = sample;
            }
          }
          peaks.push(maxVal);
          if (maxVal > globalMax) globalMax = maxVal;
        }

        if (globalMax === 0) return;

        const waveformJson = JSON.stringify(peaks.map(p => {
          const ratio = p / globalMax;
          const enhanced = Math.pow(ratio, 0.6);
          return Math.min(34, Math.max(6, Math.floor(6 + enhanced * 28)));
        }));

        getDb().update(songs).set({ waveform: waveformJson }).where(eq(songs.id, songId)).run();
      } catch (e) {
        console.error(`[WAVEFORM] Error ID ${songId}:`, e);
      }
    }
  );
}