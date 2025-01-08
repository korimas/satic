export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function formatLocalTime(time: string) {
  const date = new Date(time);
  return date.toLocaleString();
}