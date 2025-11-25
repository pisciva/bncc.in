import { Router, Request, Response } from 'express'
import { QR } from '../../models/qr'
import authMiddleware from '../../middleware/authMiddleware'
import { formatDefaulttitle } from '../../utils/main/formatDefaulttitle'

interface AuthRequest extends Request {
    user?: { userId: string }
}

const router = Router()

// create
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    const { title, originalUrl, qrColor, showLogo } = req.body
    const userId = req.user ? req.user.userId : null

    if (!originalUrl) return res.status(400).json({ message: 'Original URL is required' })

    let saveTitle: string | null = null
    if (userId) {
        if (title && title.trim() !== '') {
            saveTitle = title
        } else {
            saveTitle = await formatDefaulttitle(userId)
        }
    }

    try {
        const newQR = new QR({
            userId,
            title: saveTitle,
            originalUrl,
            qrColor,
            showLogo,
        })

        await newQR.save()

        res.status(201).json({ message: 'QR generated successfully', qr: newQR })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
})

// get all qr by user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user ? req.user.userId : null
        if (!userId) return res.status(401).json({ error: 'Unauthorized' })

        const qrs = await QR.find({ userId }).sort({ createdAt: -1 })

        res.json(qrs)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
})

// edit
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params
        const { title, originalUrl, qrColor, showLogo } = req.body
        const userId = req.user ? req.user.userId : null

        if (!userId) return res.status(401).json({ error: 'Unauthorized' })

        const qr = await QR.findOne({ _id: id, userId })
        
        if (!qr) return res.status(404).json({ error: 'QR not found' })
        if (title !== undefined) qr.title = title
        if (originalUrl !== undefined) qr.originalUrl = originalUrl
        if (qrColor !== undefined) qr.qrColor = qrColor
        if (showLogo !== undefined) qr.showLogo = showLogo

        await qr.save()

        res.status(200).json({ message: 'QR updated successfully', qr })
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})

export default router
