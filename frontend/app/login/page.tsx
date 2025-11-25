'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { InputField } from '@/components/auth/FormInput'
import axios from 'axios'
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

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>()

    const onSubmit = async (data: FormValues) => {
        setServerError('')
        try {
            const res = await axios.post('http://localhost:5000/auth/login', data)
            window.location.href = `http://localhost:3000?token=${res.data.token}`
        } catch (err: any) {
            setServerError(err.response?.data?.message || 'Login failed')
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] grid grid-cols-1 lg:grid-cols-2 justify-items-center items-center p-7">
            <LeftCol />

            <Link href="/" className="text-xs absolute top-8 left-8 inline-flex items-center gap-2 mb-6 px-4 py-1 bg-white/15 backdrop-blur-xl border border-white/30 rounded-full text-[#0054A5] font-semibold hover:bg-white/25 transition-all duration-300 shadow-7 cursor-pointer z-999 lg:hidden">
                <ArrowLeft className="w-3" />
                Back to Home
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

                    <div className="text-left mt-4">
                        <Link href="/forgot-password" className="text-[#0054A5] font-bold hover:underline ml-1">Forgot password</Link>
                    </div>

                    {serverError && <Toast message={serverError} type="error" onClose={() => setServerError('')} />}

                    <button type="submit" className="auth-button">Log In</button>
                </form>

                <OAuth />

                <p className="auth-footer">Don’t have an account? <Link href="/register">Create an account</Link></p>
            </div>
        </div>
    )
}
