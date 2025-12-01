import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { auth, getLoginRedirectUrl } from '@/lib/api'

type FormValues = { 
    email: string
    password: string 
}

export const useLoginState = () => {
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

    return {
        serverError,
        showPassword,
        loading,
        errors,
        register,
        handleSubmit,
        onSubmit,
        setShowPassword,
        setServerError
    }
}