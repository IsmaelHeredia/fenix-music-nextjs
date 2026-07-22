export interface SettingRepository {
  get(key: string): string | null;
  save(key: string, value: string): void;
}