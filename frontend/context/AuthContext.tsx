'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import axios from 'axios'
import { API_URL } from '@/lib/api'

type User = {
    id: string
    userId: number
    fullName: string
    email: string
}

type AuthContextType = {
    user: User | null
    token: string | null
    loading: boolean
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
    logout: () => { },
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkLoginStatus = async () => {
            const params = new URLSearchParams(window.location.search)
            const urlToken = params.get('token')

            if (urlToken) {
                localStorage.setItem('token', urlToken)
                setToken(urlToken)
                window.history.replaceState({}, document.title, '/')
            }

            const storedToken = localStorage.getItem('token')
            if (!storedToken) {
                setLoading(false)
                return
            }

            try {
                const res = await axios.get(`${API_URL}/api/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                })
                setUser(res.data.user)
                setToken(storedToken)
            } catch (err) {
                console.error('Token invalid atau kedaluwarsa')
                localStorage.removeItem('token')
                setToken(null)
            } finally {
                setLoading(false)
            }
        }

        checkLoginStatus()
    }, [])

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
