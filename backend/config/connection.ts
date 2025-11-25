import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI as string
        if (!uri) throw new Error("MONGO_URI not found in .env")

        await mongoose.connect(uri)
        console.log("MongoDB Atlas connected 🚀")
    } catch (err) {
        console.error("MongoDB connection error:", err)
        process.exit(1)
    }
}
