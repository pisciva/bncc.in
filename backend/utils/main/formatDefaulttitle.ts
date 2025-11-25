import { QR } from '../../models/qr'

export const formatDefaulttitle = async (userId: string): Promise<string> => {
    const countAllUntitled = await QR.countDocuments({
        userId,
        title: /^Untitled( \d+)?$/i
    })

    return `Untitled ${countAllUntitled + 1}`
}