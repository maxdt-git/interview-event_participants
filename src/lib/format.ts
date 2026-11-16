const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})

export function formatDate(iso: string): string {
    const date: Date = new Date(iso)

    if (Number.isNaN(date.getTime())) return 'Unknown date'

    return dateFormatter.format(date)
}

export function isPast(iso: string): boolean {
  const time = new Date(iso).getTime()
  return !Number.isNaN(time) && time < Date.now()
}
