'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { InputField } from '@/components/auth/FormInput'
import { auth, getLoginRedirectUrl } from '@/lib/api'
import Link from 'next/link'
import Toast from '@/components/layout/Toast'
import LeftCol from '@/components/auth/LeftCol'
import OAuth from '@/components/auth/OAuth'
import '@/components/auth/auth.css'
import '@/app/globals.css'
import { ArrowLeft } from 'lucide-react'

type FormValues = { email: string; password: string }

export default function LoginPage() {
    const [serverError, setServerError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>()

    const onSubmit = async (data: FormValues) => {
        setServerError('')
        setLoading(true)

        try {
            const response = await auth.login(data.email, data.password)
            window.location.href = getLoginRedirectUrl(response.token)
        } catch (error) {
            const err = error as Error
            setServerError(err.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] grid grid-cols-1 lg:grid-cols-2 justify-items-center items-center p-7">
            <LeftCol />

            <Link href="/" className="block lg:hidden absolute top-8 left-8 inline-flex items-center justify-center mb-6 border border-white/30 rounded-full text-[#0054A5] font-semibold  shadow-7 cursor-pointer z-50 w-10 h-10 md:w-auto md:h-auto px-0 md:px-4 py-0 md:py-1">
                <ArrowLeft className="w-3" />
                <div className="hidden md:block ml-2">Back to Home</div>
            </Link>

            <div className="w-full relative max-w-lg rounded-lg bg-[#F8FAFC] lg:p-5 lg:pl-10">
                <div className="auth-card flex flex-col w-full">
                    <div className="auth-card-header flex flex-col w-full">
                        <img src="/logo-bnccin2.svg" alt="Logo BNCC IN" />
                    </div>
                    <div>
                        <h1 className="auth-card-title">Welcome Back!</h1>
                        <h1 className="auth-card-subtitle">Select your method to log in</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
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
                        rules={{ required: 'Password is required' }}
                        showPasswordToggle
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        error={errors.password?.message} />

                    <div className="text-left lg:mt-4">
                        <Link href="/forgot-password" className="text-[#0054A5] font-bold hover:underline ml-1 text-sm sm:text-md">Forgot password</Link>
                    </div>

                    {serverError && <Toast message={serverError} type="error" onClose={() => setServerError('')} />}

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <OAuth />

                <p className="auth-footer text-sm sm:text-md">Don't have an account? <Link href="/register">Create an account</Link></p>
            </div>
        </div>
    )
}