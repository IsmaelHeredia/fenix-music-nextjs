export function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0 min';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) return `${h} h ${m} min`;
  if (m > 0) return `${m} min`;
  return `${s} s`;
}

export function parseDurationString(d: string | number | null | undefined): number {
  if (!d) return 0;
  if (typeof d === 'number') return d;
  const parts = String(d).split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parseFloat(String(d)) || 0;
}

export type MoveAction = 'top' | 'up' | 'down' | 'bottom';

export function moveArray<T>(items: T[], index: number, action: MoveAction): T[] {
  const arr = [...items];
  if (action === 'up' && index > 0)
    [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
  if (action === 'down' && index < arr.length - 1)
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
  if (action === 'top')
    arr.unshift(arr.splice(index, 1)[0]);
  if (action === 'bottom')
    arr.push(arr.splice(index, 1)[0]);
  return arr;
}

export const MOVE_BUTTONS: { action: MoveAction; symbol: string; label: string }[] = [
  { action: 'top', symbol: '⇈', label: 'Al inicio' },
  { action: 'up', symbol: '↑', label: 'Subir' },
  { action: 'down', symbol: '↓', label: 'Bajar' },
  { action: 'bottom', symbol: '⇊', label: 'Al final' },
];