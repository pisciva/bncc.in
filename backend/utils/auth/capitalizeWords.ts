export const capitalizeWords = (str: string): string => {
    return str
        .trim()
        .split(/\s+/)
        .map(word => {
            if (word.length === 0) return word
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        })
        .join(' ')
}
