import express, { Request, Response } from 'express'
import { Link } from '../../models/link'
import { getClientId, isBlocked, incrementAttempts, resetAttempts, cleanupExpiredBlocks } from '../../utils/main/rateLimitHelpers'
import { trackAnalytics } from '../../utils/main/analyticsTracker'
import { validateLinkExpiration, validateLinkCode, isDefaultLink } from '../../utils/main/linkValidators'

const router = express.Router()
setInterval(cleanupExpiredBlocks, 60 * 60 * 1000)

router.get('/:customUrl', async (req: Request, res: Response) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.setHeader('Pragma', 'no-cache')
        res.setHeader('Expires', '0')

        const { customUrl } = req.params
        const { code } = req.query
        const clientId = getClientId(req, customUrl)

        if (isDefaultLink(customUrl)) {
            return res.status(200).json({
                redirect: true,
                originalUrl: 'https://bncc.net',
                title: 'BNCC Default Link'
            })
        }

        const link = await Link.findOne({ customUrl }).lean()

        if (!link) {
            return res.status(404).json({
                error: 'Link not found',
                redirect: false
            })
        }

        const expirationError = validateLinkExpiration(link.expirationDate)
        if (expirationError) {
            return res.status(410).json({
                error: expirationError,
                redirect: false
            })
        }

        if (link.code) {
            const blockStatus = isBlocked(clientId)

            if (blockStatus.blocked) {
                return res.status(429).json({
                    error: 'Too many incorrect attempts. Please try again later.',
                    blocked: true,
                    blockedUntil: blockStatus.blockedUntil,
                    attempts: blockStatus.attempts,
                    requiresCode: true,
                    title: link.title,
                    shortenLink: link.shortenLink
                })
            }

            const codeValidation = validateLinkCode(code as string, link.code)

            if (!codeValidation.valid) {
                if (!code) {
                    return res.status(401).json({
                        error: 'Code required',
                        requiresCode: true,
                        attempts: blockStatus.attempts || 0,
                        title: link.title,
                        shortenLink: link.shortenLink
                    })
                }

                const result = incrementAttempts(clientId)

                if (result.blocked) {
                    return res.status(429).json({
                        error: 'Too many incorrect attempts. Access blocked for 3 hours.',
                        blocked: true,
                        blockedUntil: result.blockedUntil,
                        attempts: result.attempts,
                        requiresCode: true,
                        title: link.title,
                        shortenLink: link.shortenLink
                    })
                }

                return res.status(401).json({
                    error: 'Incorrect code',
                    requiresCode: true,
                    attempts: result.attempts,
                    attemptsLeft: 5 - result.attempts,
                    title: link.title,
                    shortenLink: link.shortenLink
                })
            }

            resetAttempts(clientId)
        }

        trackAnalytics(req, link._id).catch(() => { })

        return res.status(200).json({
            redirect: true,
            originalUrl: link.originalUrl,
            title: link.title
        })

    } catch (error) {
        res.status(500).json({ error: 'Server error', redirect: false })
    }
})

export default router