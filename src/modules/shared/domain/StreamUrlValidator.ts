export class StreamUrlValidator {
  private static readonly TIMEOUT_MS = 8_000;

  static async validate(url: string): Promise<void> {
    const isReachable = await this.check(url);
    if (!isReachable) {
      throw new Error("No se pudo conectar al stream. La URL no responde");
    }
  }

  private static async check(url: string): Promise<boolean> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        method: "HEAD",
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
        }
      });

      if (!res.ok && res.status !== 403) {
        const getRes = await fetch(url, { 
          method: "GET", 
          signal: controller.signal,
          headers: { 'Range': 'bytes=0-1024' }
        });
        return getRes.ok || getRes.status === 206;
      }

      return res.ok || [200, 206, 401, 403].includes(res.status);
    } catch (err) {
      return false;
    } finally {
      clearTimeout(timer);
    }
  }
}