'use client'

import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { InputField } from '@/components/auth/FormInput'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Toast from '@/components/layout/Toast'
import Link from 'next/link'

function ResetPasswordContent() {
    const { register, handleSubmit, formState: { errors } } = useForm<{ password: string; confirmPassword: string }>()
    const [serverError, setServerError] = useState('')
    const [serverMessage, setServerMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [countdown, setCountdown] = useState<number | null>(null)

    const token = useSearchParams().get('token')
    const router = useRouter()

    const onSubmit = async (data: { password: string; confirmPassword: string }) => {
        setServerError('');
        setServerMessage('')

        if (!token) return setServerError('Missing token in URL')
        if (data.password !== data.confirmPassword) return setServerError('Passwords do not match')

        try {
            const res = await axios.post('http://localhost:5000/reset-password', {
                token,
                password: data.password
            })

            setServerMessage(res.data.message || 'Password reset successful!')
            setCountdown(3)

            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev === null || prev <= 1) {
                        clearInterval(countdownInterval)
                        return null
                    }
                    return prev - 1
                })
            }, 1000)

            setTimeout(() => router.push('/login'), 3000)

        } catch (error) {
            const err = error as { response?: { data?: { message?: string } }; message?: string }
            setServerError(err.response?.data?.message || err.message || 'Reset failed.')
        }
    }

    const passwordFieldProps = (name: 'password' | 'confirmPassword', placeholder: string) => ({
        type: 'password',
        icon: '/icon-password.svg',
        placeholder,
        register,
        name,
        rules: {
            required: `${placeholder} is required`,
            minLength: { value: 6, message: 'Minimum 6 characters' }
        },
        showPasswordToggle: true,
        showPassword,
        setShowPassword,
        error: errors[name]?.message
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
            <div className="w-full max-w-lg bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-1 p-8 sm:p-10 relative">
                <div className="absolute left-1/2 -top-9 transform -translate-x-1/2">
                    <div className="w-50 h-17 border-2 bg-[#F8FAFC] backdrop-blur-xl border-white/40 rounded-full shadow-2 flex items-center justify-center">
                        <img src="/logo-bnccin2.svg" className="w-32" alt="Logo" />
                    </div>
                </div>

                <div className="mt-8 mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0054A5] mb-3">Reset Password</h1>
                    <p className="text-sm sm:text-base text-[#64748B] font-medium">
                        You&apos;re almost there! Enter your new password below to finish resetting your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <InputField {...passwordFieldProps('password', 'Password')} />
                    <InputField {...passwordFieldProps('confirmPassword', 'Confirm Password')} />

                    <button type="submit" className="w-full h-12 sm:h-14 bg-gradient-to-r from-[#0054A5] to-[#003d7a] text-white font-semibold text-base sm:text-lg rounded-xl hover:shadow-3 transition-all duration-300 cursor-pointer">
                        Reset Password
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="text-sm text-[#0054A5] font-semibold hover:underline inline-flex items-center gap-2 justify-center"
                    >
                        <img src="/images/back.svg" className='w-3' alt="" />
                        Back to Login
                    </Link>
                </div>
            </div>

            {serverMessage && (
                <Toast
                    message={
                        countdown !== null
                            ? `${serverMessage} Redirecting in ${countdown}...`
                            : serverMessage
                    }
                    type="success"
                    onClose={() => setServerMessage('')}
                />
            )}
            {serverError && (
                <Toast
                    message={serverError}
                    type="error"
                    onClose={() => setServerError('')}
                />
            )}
        </div>
    )
}

export default function ResetPass() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="w-16 h-16 border-4 border-[#0054A5]/30 border-t-[#0054A5] rounded-full animate-spin"></div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}