const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const fetchLinks = async () => {
    const res = await fetch(`${API_URL}/api/links`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    return res.json()
}

export const fetchRedirect = async (customUrl: string, code?: string) => {
    const url = `${API_URL}/api/redirect/${customUrl}${code ? `?code=${code}` : ''}`
    return fetch(url, {
        cache: 'no-store',
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
    })
}