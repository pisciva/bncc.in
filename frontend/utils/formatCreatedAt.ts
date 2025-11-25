export const formatCreatedAt = (date: Date | string) => {
    const d = new Date(date)
    const day = d.getDate()
    const month = d.toLocaleString("en-US", {
        month: "short",
        timeZone: "Asia/Jakarta",
    })
    const year = d.getFullYear()
    const time = d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
    })
    return `${day} ${month} ${year}, ${time} WIB`
}
