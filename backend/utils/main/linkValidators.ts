export const isDefaultLink = (customUrl: string): boolean => {
    return customUrl.length >= 1 && customUrl.length <= 3
}

export const validateLinkExpiration = (expirationDate?: Date | null): string | null => {
    if (!expirationDate) {
        return null
    }

    const expDate = new Date(expirationDate)
    const now = new Date()

    if (expDate < now) {
        return 'Link has expired'
    }

    return null
}

export const validateLinkCode = (
    providedCode: string | undefined,
    requiredCode: string
): { valid: boolean; error?: string } => {
    if (!providedCode) {
        return { valid: false, error: 'Code required' }
    }

    if (providedCode !== requiredCode) {
        return { valid: false, error: 'Incorrect code' }
    }

    return { valid: true }
}