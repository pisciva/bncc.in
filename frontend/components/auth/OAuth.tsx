'use client'

import React from 'react'

export default function OAuth() {
    return (
        <div className="mt-4">
            <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-[#64748B] font-semibold text-md">or continue with</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
                onClick={() => (window.location.href = 'http://localhost:5000/auth/google')}
                className="button-auth">
                <img src="/logo-google.svg" alt="Google" className="w-7 h-7 mr-3" />
                Google
            </button>

            <button
                onClick={() => (window.location.href = 'http://localhost:5000/auth/github')}
                className="button-auth">
                <img src="/logo-github.svg" alt="GitHub" className="w-7 h-7 mr-3" />
                GitHub
            </button>
        </div>
    )
}
