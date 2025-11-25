import crypto from 'crypto'

export function generateResetToken(expiryMinutes = 15) {
    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + expiryMinutes * 60 * 1000)

    return { token, expiry }
}