import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { VideoRepository } from '@/modules/videos/domain/VideoRepository';

export class VideoScanner {
  private validExts = ['.mp4', '.mkv', '.avi', '.mov', '.webm'];

  constructor(private videoRepo: VideoRepository) { }

  async scan(dirPath: string): Promise<{ added: number; skipped: number }> {
    if (!existsSync(dirPath)) throw new Error(`Carpeta no encontrada: ${dirPath}`);

    let added = 0;
    let skipped = 0;
    const found: string[] = [];

    const scanFolder = async (currentDir: string) => {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await scanFolder(fullPath);
          continue;
        }

        const ext = path.extname(entry.name).toLowerCase();
        if (!this.validExts.includes(ext)) continue;

        const relative = path.relative(dirPath, fullPath);
        found.push(relative);

        if (!this.videoRepo.findAll().find(v => v.filename === relative)) {
          this.videoRepo.save({
            name: path.basename(entry.name, ext),
            filename: relative
          });
          added++;
        } else {
          skipped++;
        }
      }
    };

    await scanFolder(dirPath);

    if (this.videoRepo.deleteMissing) {
      this.videoRepo.deleteMissing(found);
    }

    return { added, skipped };
  }
}