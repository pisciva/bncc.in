// routes/auth/password.ts
import express, { Request, Response } from 'express'
import { User } from '../../models/user'
import { message } from './messages'
import { generateResetToken } from '../../utils/auth/generateResetToken'
import { sendResetPasswordEmail } from '../../utils/auth/sendResetPasswordEmail'
import { hashPassword } from '../../utils/auth/hashPassword'

const router = express.Router()

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

router.post('/forgot-password', async (req: Request, res: Response) => {
    const startTime = Date.now()
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔵 FORGOT PASSWORD REQUEST STARTED')
    console.log('⏰ Timestamp:', new Date().toISOString())
    
    const { email } = req.body
    console.log('📧 Email received:', email)

    if (!email) {
        console.log('❌ No email provided')
        return res.status(400).json({ message: message.email_required })
    }

    try {
        console.log('🔍 Searching for user in database...')
        const user = await User.findOne({ email })
        
        if (!user) {
            console.log('❌ User not found in database')
            return res.status(404).json({ message: message.email_not_found })
        }

        console.log('✅ User found:', user.fullName || 'Unknown')
        console.log('🔐 Generating reset token...')
        
        const { token, expiry } = generateResetToken(15)
        user.resetToken = token
        user.resetTokenExpiry = expiry
        
        console.log('💾 Saving token to database...')
        await user.save()
        console.log('✅ Token saved successfully')

        const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`
        console.log('🔗 Reset link:', resetLink)
        
        console.log('📮 Attempting to send email...')
        console.log('📧 To:', user.email)
        console.log('👤 Name:', user.fullName || 'User')
        console.log('🔧 EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set')
        console.log('🔧 EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set')
        
        const emailStartTime = Date.now()
        await sendResetPasswordEmail(user.email, user.fullName || "User", resetLink)
        const emailDuration = ((Date.now() - emailStartTime) / 1000).toFixed(2)
        
        console.log(`✅ Email sent successfully in ${emailDuration}s`)
        
        const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2)
        console.log(`⏱️ Total request duration: ${totalDuration}s`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

        return res.json({ message: message.reset_success })
        
    } catch (err) {
        const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2)
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.error('❌ ERROR IN FORGOT PASSWORD')
        console.error('⏱️ Failed after:', totalDuration + 's')
        
        // Proper error handling
        const error = err as Error
        console.error('❌ Error type:', error.name || 'Unknown')
        console.error('❌ Error message:', error.message || 'No message')
        console.error('❌ Stack trace:', error.stack || 'No stack trace')
        console.error('❌ Full error:', err)
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        
        return res.status(500).json({ 
            message: message.reset_failed,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
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
    } catch (err) {
        const error = err as Error
        console.error('❌ Reset password error:', error.message)
        return res.status(500).json({ message: message.reset_password_failed })
    }
})

export default router