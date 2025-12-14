export default function formatDuration(ms: number): string {
  const totalSeconds: number = Math.floor(ms / 1000)
  const hours: number = Math.floor(totalSeconds / 3600)
  const minutes: number = Math.floor((totalSeconds % 3600) / 60)
  const seconds: number = totalSeconds % 60

  const pad = (n: number) => n.toString().padStart(2, "0")
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }

  return `${pad(minutes)}:${pad(seconds)}`
}
