export function formatDate(dateString: string) {
  const parts = dateString.split('-')

  const year = Number(parts[0])
  const month = Number(parts[1]) - 1
  const day = Number(parts[2])

  const date = new Date(year, month, day)

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function getTaskDateTime(
  dateString: string,
  timeString: string | null
) {
  const dateParts = dateString.split('-')

  const year = Number(dateParts[0])
  const month = Number(dateParts[1]) - 1
  const day = Number(dateParts[2])

  if (timeString === null) {
    return new Date(year, month, day)
  }

  const timeParts = timeString.split(' ')
  const clockParts = timeParts[0].split(':')

  let hour = Number(clockParts[0])
  const minute = Number(clockParts[1])
  const period = timeParts[1]

  if (period === 'PM' && hour !== 12) {
    hour = hour + 12
  }

  if (period === 'AM' && hour === 12) {
    hour = 0
  }

  return new Date(year, month, day, hour, minute)
}