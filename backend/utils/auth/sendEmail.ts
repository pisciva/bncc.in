import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function sendEmail(
    to: string,
    subject: string,
    html: string
) {
    try {
        const data = await resend.emails.send({
            from: 'bncc.in <onboarding@resend.dev>',
            to,
            subject,
            html,
            tags: [
                {
                    name: 'category',
                    value: 'password_reset'
                }
            ],
            headers: {
                'X-Entity-Ref-ID': '123456789'
            }
        })
        return data
    } catch (error) {
        throw error
    }
}