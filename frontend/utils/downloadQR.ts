import { toPng, toSvg } from 'html-to-image'

export const downloadQR = async (
    qrRef: HTMLElement | null,
    name: string = 'qr-code',
    type: 'png' | 'svg' = 'png'
) => {
    if (!qrRef) return
    try {
        const dataUrl =
            type === 'png'
                ? await toPng(qrRef, { pixelRatio: 15 })
                : await toSvg(qrRef)
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = `${name.trim().replace(/[^A-z0-9]/gi, '-')}.${type}`
        a.click()
    } catch (err) {
        alert('Failed to download QR code.')
    }
}
