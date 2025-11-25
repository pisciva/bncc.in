import express, { Request, Response } from 'express'
import { Analytics } from '../../models/analytics'
import { Link } from '../../models/link'
import authMiddleware from '../../middleware/authMiddleware'
import { getUserId, verifyLinkOwnership, getOrCreateAnalytics, transformAnalyticsData } from '../../utils/main/analytics'

const router = express.Router()

// analytics link
router.get('/:linkId', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { linkId } = req.params

        const userId = getUserId(req.user)
        if (!userId) return res.status(401).json({ error: 'Unauthorized' })

        const link = await verifyLinkOwnership(linkId, userId)
        if (!link) return res.status(404).json({ error: 'Link not found or unauthorized' })

        const analytics = await getOrCreateAnalytics(linkId)
        const analyticsData = transformAnalyticsData(analytics)

        return res.json({ analytics: analyticsData })
    } catch (error) {
        return res.status(500).json({ error: 'Server error' })
    }
})

// analytics summary
router.get('/summary/all', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req.user)
        if (!userId) return res.status(401).json({ error: 'Unauthorized' })

        const links = await Link.find({ userId }).select('_id').lean()
        const linkIds = links.map(link => link._id)

        const analyticsArray = await Analytics.find({
            linkId: { $in: linkIds }
        }).lean()

        const uniqueUsersSet = new Set<string>()
        let totalClicks = 0
        let linksWithClicks = 0

        for (const analytics of analyticsArray) {
            totalClicks += analytics.totalClicks || 0
            if (analytics.uniqueUsers?.length) analytics.uniqueUsers.forEach(user => uniqueUsersSet.add(user))
            if ((analytics.totalClicks || 0) > 0) linksWithClicks++
        }

        return res.json({
            summary: {
                totalClicks,
                totalUniqueUsers: uniqueUsersSet.size,
                totalLinks: links.length,
                linksWithClicks
            }
        })
    } catch (error) {
        return res.status(500).json({ error: 'Server error' })
    }
})

export default router