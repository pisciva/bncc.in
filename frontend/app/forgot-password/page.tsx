'use client'

import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import Toast from '@/components/layout/Toast'
import axios from 'axios'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPass() {
    const { register, handleSubmit } = useForm<{ email: string }>({ mode: 'onSubmit', })
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [cooldown, setCooldown] = useState(0)

    useEffect(() => {
        const lastSubmit = localStorage.getItem('forgotPassLastSubmit')
        if (lastSubmit) {
            const elapsed = Math.floor((Date.now() - parseInt(lastSubmit)) / 1000)
            const remaining = 30 - elapsed
            if (remaining > 0) setCooldown(remaining)
        }
    }, [])

    useEffect(() => {
        if (cooldown <= 0) return
        const timer = setInterval(() => setCooldown(prev => prev - 1), 1000)
        return () => clearInterval(timer)
    }, [cooldown])

    const onSubmit = async (data: { email: string }) => {
        setError('')
        setMessage('Processing your request...')
        setLoading(true)

        try {
            const res = await axios.post('http://localhost:5000/forgot-password', data)
            setMessage(res.data.message)
            setCooldown(30)
            localStorage.setItem('forgotPassLastSubmit', Date.now().toString())
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } }
            setError(err.response?.data?.message || 'Oops! Something went wrong. Please try again later.')
            setMessage('')
        } finally {
            setLoading(false)
        }
    }

    const onError = (errors: Record<string, any>) => {
        if (errors.email) {
            setError(errors.email.message)
            setMessage('')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
            <div className="w-full max-w-lg bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-1 p-8 sm:p-10 relative">
                <div className="absolute left-1/2 -top-9 transform -translate-x-1/2">
                    <div className="w-50 h-17 border-2 bg-[#F8FAFC] backdrop-blur-xl border-white/40 rounded-full shadow-2 flex items-center justify-center">
                        <img src="/logo-bnccin2.svg" className="w-32" alt="Logo" />
                    </div>
                </div>

                <div className="mt-8 mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0054A5] mb-3">Forgot your password?</h1>
                    <p className="text-sm sm:text-base text-[#64748B] font-medium">
                        It's okay, it happens to the best of us. Enter your email, and we'll send you a link to reset it.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] z-10" />
                        <input
                            {...register('email', {
                                required: "Hey, don't forget input your email <3",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Hmm… we can't find your account in our system. Please try again.",
                                },
                            })}
                            placeholder="Email"
                            disabled={loading || cooldown > 0}
                            className="w-full h-12 sm:h-14 pl-12 pr-4 rounded-xl bg-white/10 backdrop-blur-xl border border-[#D3D3D3] shadow-5 text-[#0054A5] font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#0054A5]/30 focus:shadow-6 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || cooldown > 0}
                        className={`w-full h-12 sm:h-14 font-semibold text-base sm:text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${loading
                            ? 'bg-yellow-500/80 text-white cursor-not-allowed' : cooldown > 0
                                ? 'bg-gray-400/80 text-white cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#0054A5] to-[#003d7a] text-white hover:shadow-3 cursor-pointer'
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : cooldown > 0 ? (`Wait ${cooldown}s`
                        ) : ('Send Email')}
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

            {message && (
                <Toast
                    message={message}
                    type={loading ? 'warning' : 'success'}
                    onClose={() => setMessage('')}
                />
            )}
            {error && <Toast message={error} type="error" onClose={() => setError('')} />}
        </div>
    )
}