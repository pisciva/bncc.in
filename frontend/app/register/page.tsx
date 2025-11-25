'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { InputField } from '@/components/auth/FormInput'
import { auth } from '@/lib/api'
import Link from 'next/link'
import LeftCol from '@/components/auth/LeftCol'
import OAuth from '@/components/auth/OAuth'
import Toast from '@/components/layout/Toast'
import '@/components/auth/auth.css'
import { ArrowLeft } from 'lucide-react'

type FormValues = {
    fullName: string
    email: string
    password: string
    confirmPassword: string
}

export default function RegisterPage() {
    const router = useRouter()
    const [serverError, setServerError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [countdown, setCountdown] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormValues>()

    const onSubmit = async (data: FormValues) => {
        setServerError('')
        setSuccessMessage('')

        if (data.password !== data.confirmPassword) {
            return setServerError('Passwords do not match')
        }

        setLoading(true)

        try {
            const response = await auth.register(data.fullName, data.email, data.password)

            setSuccessMessage(`${response.message} Redirecting to login...`)
            reset()

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

            setTimeout(() => {
                router.push('/login')
            }, 3000)

        } catch (error) {
            const err = error as Error
            setServerError(err.message || 'Registration failed, try again')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] grid grid-cols-1 lg:grid-cols-2 justify-items-center items-center p-7">
            <LeftCol />

            <Link href="/" className="text-xs absolute top-8 left-8 inline-flex items-center gap-2 mb-6 px-4 py-1 bg-white/15 backdrop-blur-xl border border-white/30 rounded-full text-[#0054A5] font-semibold hover:bg-white/25 transition-all duration-300 shadow-7 cursor-pointer z-999 lg:hidden">
                <ArrowLeft className="w-3" />
                Back to Home
            </Link>

            <div className="w-full max-w-lg rounded-lg bg-[#F8FAFC] lg:p-5 lg:pl-10">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <img src="/logo-bnccin2.svg" alt="Logo BNCC IN" />
                    </div>
                    <div>
                        <h1 className="auth-card-title">Create Account</h1>
                        <h1 className="auth-card-subtitle">Select your method to sign up</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <InputField
                        icon="/icon-people.svg"
                        placeholder="Name"
                        register={register}
                        name="fullName"
                        rules={{
                            required: "Name is required",
                            maxLength: {
                                value: 50,
                                message: "Max 50 characters"
                            }
                        }}
                        maxLength={50}
                        error={errors.fullName?.message} />

                    <InputField
                        icon="/icon-email.svg"
                        placeholder="Email"
                        register={register}
                        name="email"
                        rules={{
                            required: "Email is required",
                            pattern: {
                                value: /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{1,}$/,
                                message: "Invalid email address"
                            }
                        }}
                        error={errors.email?.message} />

                    <InputField
                        type="password"
                        icon="/icon-password.svg"
                        placeholder="Password"
                        register={register}
                        name="password"
                        rules={{
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Minimum 6 characters"
                            }
                        }}
                        showPasswordToggle
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        error={errors.password?.message}
                    />

                    <InputField
                        type="password"
                        icon="/icon-password.svg"
                        placeholder="Confirm Password"
                        register={register}
                        name="confirmPassword"
                        rules={{
                            required: "Please confirm your password",
                            minLength: {
                                value: 6,
                                message: "Minimum 6 characters"
                            }
                        }}
                        showPasswordToggle
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        error={errors.confirmPassword?.message}
                    />

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="auth-button disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                <OAuth />

                <p className="auth-footer">
                    Already have an account? <Link href="/login">Sign in</Link>
                </p>
            </div>

            {serverError && (
                <Toast
                    message={serverError}
                    type="error"
                    onClose={() => setServerError('')} />
            )}
            {successMessage && (
                <Toast
                    message={
                        countdown !== null
                            ? `${successMessage.split('Redirecting')[0]} Redirecting in ${countdown}...`
                            : successMessage
                    }
                    type="success"
                    onClose={() => setSuccessMessage('')} />
            )}
        </div>
    )
}