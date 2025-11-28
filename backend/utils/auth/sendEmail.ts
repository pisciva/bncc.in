import nodemailer from 'nodemailer'

export default async function sendEmail(
    to: string,
    subject: string,
    html: string
): Promise<void> {
    console.log('📧 [SendEmail] Starting...')
    console.log('📧 [SendEmail] To:', to)
    console.log('📧 [SendEmail] From:', process.env.EMAIL_USER)
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ [SendEmail] Missing credentials!')
        throw new Error('Email credentials not configured')
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })

    console.log('📧 [SendEmail] Transporter created')

    try {
        const info = await transporter.sendMail({
            from: `"Your App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        })

        console.log('✅ [SendEmail] Success! Message ID:', info.messageId)
        console.log('✅ [SendEmail] Response:', info.response)
    } catch (error: any) {
        console.error('❌ [SendEmail] Failed!')
        console.error('❌ [SendEmail] Error code:', error.code)
        console.error('❌ [SendEmail] Error message:', error.message)
        console.error('❌ [SendEmail] Command:', error.command)
        throw error
    }
}