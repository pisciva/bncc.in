export function formatDuration(expirationDate?: string | Date): string {
    if (!expirationDate) return ''

    const now = new Date()
    const exp = new Date(expirationDate)

    exp.setHours(23, 59, 59, 999)

    if (exp <= now) return ''

    const diffMs = exp.getTime() - now.getTime()
    let diffDays = Math.ceil(diffMs / 864e5)

    let years = 0, months = 0, days = 0

    if (diffDays >= 365) {
        years = Math.floor(diffDays / 365)
        diffDays %= 365
    }
    if (diffDays >= 30) {
        months = Math.floor(diffDays / 30)
        diffDays %= 30
    }
    days = diffDays

    const parts: string[] = []
    if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`)
    if (months) parts.push(`${months} month${months > 1 ? 's' : ''}`)
    if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`)

    return parts.length ? `Valid for ${parts.join(', ')}` : ''
}
