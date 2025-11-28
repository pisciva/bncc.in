import express, { Request, Response } from 'express'
import { User } from '../../models/user'
import { message } from './messages'
import { generateResetToken } from '../../utils/auth/generateResetToken'
import { sendResetPasswordEmail } from '../../utils/auth/sendResetPasswordEmail'
import { hashPassword } from '../../utils/auth/hashPassword'

const router = express.Router()

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

router.post('/forgot-password', async (req: Request, res: Response) => {
    const { email } = req.body

    console.log('📧 [Forgot Password] Request received for:', email)
    console.log('🔧 [Config] EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set')
    console.log('🔧 [Config] EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set')

    if (!email) {
        return res.status(400).json({ message: message.email_required })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            console.log('❌ [User] Not found:', email)
            return res.status(404).json({ message: message.email_not_found })
        }

        console.log('✅ [User] Found:', user.email)

        const { token, expiry } = generateResetToken(15)
        user.resetToken = token
        user.resetTokenExpiry = expiry
        await user.save()

        console.log('✅ [Token] Generated and saved')

        const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`
        console.log('🔗 [Reset Link]:', resetLink)

        console.log('📤 [Email] Attempting to send...')
        await sendResetPasswordEmail(user.email, user.fullName || "User", resetLink)
        console.log('✅ [Email] Sent successfully!')

        return res.json({ message: message.reset_success })
    } catch (err: any) {
        console.error('❌ [Error] Details:', err.message)
        console.error('❌ [Error] Stack:', err.stack)
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

        if (!user) {
            return res.status(400).json({ message: message.token_expired })
        }

        user.password = await hashPassword(password)
        user.resetToken = null
        user.resetTokenExpiry = null
        await user.save()

        return res.json({ message: message.reset_password_success })
    } catch (err: any) {
        console.error('❌ [Reset Password Error]:', err.message)
        return res.status(500).json({ message: message.reset_password_failed })
    }
})

export default router