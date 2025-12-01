import express, { Request, Response } from 'express'
import { User } from '../../models/user'
import { message } from './messages'
import { generateResetToken } from '../../utils/auth/generateResetToken'
import { sendResetPasswordEmail } from '../../utils/auth/sendResetPasswordEmail'
import { hashPassword } from '../../utils/auth/hashPassword'

const router = express.Router()

const FRONTEND_URL = process.env.FRONTEND_URL

router.post('/forgot-password', async (req: Request, res: Response) => {
    const { email } = req.body

    if (!email) return res.status(400).json({ message: message.email_required })

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: message.email_not_found })

        const { token, expiry } = generateResetToken(15)
        user.resetToken = token
        user.resetTokenExpiry = expiry
        await user.save()

        const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`
        await sendResetPasswordEmail(user.email, user.fullName || "User", resetLink)

        return res.json({ message: message.reset_success })
    } catch (err) {
        return res.status(500).json({ message: message.reset_failed })
    }
})

router.post('/reset-password', async (req: Request, res: Response) => {
    const { token, password } = req.body

    if (!token || !password) {
        return res.status(400).json({ message: message.token_password_required })
    }

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        })
        if (!user) return res.status(400).json({ message: message.token_expired })

        user.password = await hashPassword(password)
        user.resetToken = null
        user.resetTokenExpiry = null
        await user.save()

        return res.json({ message: message.reset_password_success })
    } catch (err) {
        return res.status(500).json({ message: message.reset_password_failed })
    }
})

export default router