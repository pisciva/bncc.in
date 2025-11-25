import mongoose, { Document, Schema } from 'mongoose'

interface QRDoc extends Document {
    userId: number | null
    title: string | null
    originalUrl: string
    qrColor: string
    showLogo: boolean
    createdAt?: Date
    updatedAt?: Date
}

const qrSchema = new Schema<QRDoc>({
    userId: { type: Number, default: null },
    title: { type: String, default: null },
    originalUrl: { type: String, required: true },
    qrColor: { type: String, required: true },
    showLogo: { type: Boolean, default: false }
}, { timestamps: true })

const QR = mongoose.model<QRDoc>('QR', qrSchema)

export { QR, QRDoc }
