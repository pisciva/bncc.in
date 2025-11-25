import mongoose, { Document, Schema } from 'mongoose'

interface LinkDoc extends Document {
    userId: number | null
    title: string | null
    originalUrl: string
    customUrl?: string
    shortenLink?: string
    qr: {
        enabled: boolean
        qrColor: string
        showLogo: boolean
    }
    code?: string | null
    expirationDate?: Date | null
    createdAt?: Date
    updatedAt?: Date
}

const linkSchema = new Schema<LinkDoc>({
    userId: { type: Number, default: null },
    title: { type: String, default: null },
    originalUrl: { type: String, required: true },
    customUrl: { type: String, unique: true, sparse: true },
    shortenLink: { type: String },
    qr: {
        enabled: { type: Boolean, default: false },
        qrColor: { type: String, default: '#000000' },
        showLogo: { type: Boolean, default: false }
    },
    code: { type: String, default: null },
    expirationDate: { type: String, default: null }
}, { timestamps: true })

const Link = mongoose.model<LinkDoc>('Link', linkSchema)

export { Link, LinkDoc }
