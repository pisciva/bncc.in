import mongoose, { Document, Schema } from 'mongoose'

interface UserDoc extends Document {
    userId: number
    fullName?: string
    email: string
    password?: string
    resetToken?: string | null
    resetTokenExpiry?: Date | null
}

const userSchema = new Schema<UserDoc>({
    userId: { type: Number, unique: true, required: true },
    fullName: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null }
})

const User = mongoose.model<UserDoc>('User', userSchema)

export { User, UserDoc }
