import sendEmail from './sendEmail'
import { resetPasswordTemplate } from './resetPasswordTemplate'

export async function sendResetPasswordEmail(to: string, name: string, link: string) {
    return await sendEmail(
        to,
        "Reset your password",
        resetPasswordTemplate(link, name, "15 minutes")
    )
}