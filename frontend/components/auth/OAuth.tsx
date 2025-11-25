'use client'

import React from 'react'
import { API_URL } from '@/lib/api'

export default function OAuth() {
    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/auth/google`
    }

    const handleGithubLogin = () => {
        window.location.href = `${API_URL}/auth/github`
    }

    return (
        <div className="mt-4">
            <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-[#64748B] font-semibold text-md">or continue with</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
                onClick={handleGoogleLogin}
                className="button-auth"
                type="button"
            >
                <img src="/logo-google.svg" alt="Google" className="w-7 h-7 mr-3" />
                Google
            </button>

            <button
                onClick={handleGithubLogin}
                className="button-auth"
                type="button"
            >
                <img src="/logo-github.svg" alt="GitHub" className="w-7 h-7 mr-3" />
                GitHub
            </button>
        </div>
    )
}