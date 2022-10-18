export function secondsToFormatedDuration(d: number) {
  const hours = Math.floor(d / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((d % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((d % 3600) % 60)
    .toString()
    .padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
