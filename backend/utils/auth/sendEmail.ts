import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export default async function sendEmail(
    to: string,
    subject: string,
    html: string
) {
    console.log('Sending email to:', to)

    const data = await resend.emails.send({
        from: 'bncc.in <no-reply@bncc.in>',
        to,
        subject,
        html,
    })

    console.log('Resend response:', data)
    return data
}
