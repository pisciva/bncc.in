import express, { Request, Response } from 'express'
import { Link } from '../../models/link'
import { Analytics } from '../../models/analytics'
import authMiddleware from '../../middleware/authMiddleware'
import { formatDefaultName } from '../../utils/main/formatDefaultName'

const router = express.Router()

// create
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    const { title, originalUrl, customUrl, code, expirationDate, qr } = req.body
    const userId = (req as any).user ? (req as any).user.userId : null

    const shortenLink = `https://bncc.in/${customUrl.trim()}`

    let saveTitle: string | null = null
    if (userId) {
        if (title && title.trim() !== '') {
            saveTitle = title
        } else {
            saveTitle = await formatDefaultName(userId)
        }
    }

    try {
        const existing = await Link.findOne({ customUrl: customUrl.trim() })
        if (existing) return res.status(400).json({ error: 'Custom link is already in use' })

        const newLink = new Link({
            title: saveTitle,
            userId,
            originalUrl,
            customUrl: customUrl.trim(),
            shortenLink,
            code,
            expirationDate,
            qr: qr ? {
                enabled: qr.enabled,
                qrColor: qr.qrColor || '#000000',
                showLogo: qr.showLogo || false,
            } : { enabled: false },
        })

        await newLink.save()
        res.status(201).json({ message: 'Link created successfully', link: newLink })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
})

// get all link by user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user ? (req as any).user.userId : null
        if (!userId) return res.status(401).json({ error: 'Unauthorized' })

        const links = await Link.find({ userId }).sort({ createdAt: -1 })
        res.json(links)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
})

// edit
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { title, customUrl, originalUrl, code, expirationDate, qr } = req.body
        const userId = (req as any).user ? (req as any).user.userId : null

        if (!userId) return res.status(401).json({ error: 'Unauthorized' })

        const link = await Link.findOne({ _id: id, userId })
        if (!link) return res.status(404).json({ error: 'Link not found' })

        if (customUrl !== undefined && customUrl.trim() !== link.customUrl) {
            const existing = await Link.findOne({ customUrl: customUrl.trim() })
            if (existing) return res.status(400).json({ error: 'Custom link is already in use' })
        }

        if (title !== undefined) link.title = title
        if (customUrl !== undefined) {
            link.customUrl = customUrl.trim()
            link.shortenLink = `https://bncc.in/${customUrl.trim()}`
        }
        if (code !== undefined) link.code = code
        if (originalUrl !== undefined) link.originalUrl = originalUrl
        if (expirationDate !== undefined) link.expirationDate = expirationDate
        if (qr !== undefined) {
            link.qr = {
                enabled: qr.enabled,
                qrColor: qr.qrColor || link.qr?.qrColor || '#000000',
                showLogo: qr.showLogo || false,
            }
        }

        await link.save()
        res.status(200).json({ message: 'Link updated successfully', link })
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})

// delete link (CASCADE DELETE ANALYTICS)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const userId = (req as any).user ? (req as any).user.userId : null

        if (!userId) return res.status(401).json({ error: 'Unauthorized' })

        const link = await Link.findOne({ _id: id, userId })
        if (!link) return res.status(404).json({ error: 'Link not found' })

        // Delete analytics associated with this link
        await Analytics.deleteOne({ linkId: id })
        console.log(`✅ Analytics deleted for link: ${id}`)

        // Delete the link
        await Link.deleteOne({ _id: id })
        console.log(`✅ Link deleted: ${id}`)

        res.status(200).json({ message: 'Link and its analytics deleted successfully' })
    } catch (error: any) {
        console.error('❌ Delete error:', error.message)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router