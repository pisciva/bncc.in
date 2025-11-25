import { Link } from '../../models/link'

export async function formatDefaultName(userId: number): Promise<string> {
    const countAllUntitled = await Link.countDocuments({
        userId,
        title: new RegExp(`^Untitled( \\d+)?$`, 'i'),
    })

    return `Untitled ${countAllUntitled + 1}`
}
