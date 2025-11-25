import { toPng } from 'html-to-image'

export const copyQR = async (qrRef: HTMLElement | null) => {
    if (!qrRef) return
    try {
        const dataUrl = await toPng(qrRef, { pixelRatio: 15 })
        const blob = await (await fetch(dataUrl)).blob()
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        alert('QR code copied to clipboard!')
    } catch (err) {
        
        alert('Copy to clipboard failed.')
    }
}
