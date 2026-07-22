import { SettingRepository } from '@/modules/settings/domain/SettingRepository';
import { MusicScanner } from '@/modules/tracks/infrastructure/MusicScanner';
import { VideoScanner } from '@/modules/videos/infrastructure/VideoScanner';

export class SyncLibrary {
  constructor(
    private settingsRepo: SettingRepository,
    private musicScanner: MusicScanner,
    private videoScanner: VideoScanner
  ) { }

  async execute(musicPath?: string, videoPath?: string, triggerScan: boolean = false) {
    const startTime = performance.now();

    if (musicPath !== undefined) this.settingsRepo.save('music_directory', musicPath);
    if (videoPath !== undefined) this.settingsRepo.save('video_directory', videoPath);

    if (!triggerScan) {
      return { success: true, scan_stats: null };
    }

    const mPath = musicPath || this.settingsRepo.get('music_directory');
    const vPath = videoPath || this.settingsRepo.get('video_directory');

    let totalAdded = 0;
    let totalSkipped = 0;

    if (mPath) {
      const musicRes = await this.musicScanner.scan(mPath);
      totalAdded += musicRes.added;
      totalSkipped += musicRes.skipped;
    }

    if (vPath) {
      const videoRes = await this.videoScanner.scan(vPath);
      totalAdded += videoRes.added;
      totalSkipped += videoRes.skipped;
    }

    const endTime = performance.now();
    const totalSeconds = Math.floor((endTime - startTime) / 1000);
    const duration = `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;

    return {
      success: true,
      scan_stats: {
        added: totalAdded,
        skipped: totalSkipped,
        duration
      }
    };
  }
}