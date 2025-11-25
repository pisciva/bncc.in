export interface LinkType {
    _id: string
    userId: string
    title: string
    originalUrl: string
    customUrl: string
    shortenLink: string
    code: string
    expirationDate: Date
    createdAt: string
    qr: {
        enabled: boolean
        qrColor: string
        showLogo: boolean
    }
}