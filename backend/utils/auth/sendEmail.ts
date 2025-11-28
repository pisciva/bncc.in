import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function sendEmail(
    to: string,
    subject: string,
    html: string
) {
    try {
        const data = await resend.emails.send({
            from: 'BNCC-IN <onboarding@resend.dev>',
            to,
            subject,
            html,
        })

        console.log('📧 [Resend] Email sent:', data)
        return data
    } catch (error) {
        console.error('❌ [Resend] Failed:', error)
        throw error
    }
}
