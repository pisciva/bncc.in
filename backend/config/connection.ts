import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        // ⚠️ Support both MONGODB_URI and MONGO_URI
        const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI
        
        if (!mongoURI) {
            throw new Error('MongoDB URI is not defined in environment variables')
        }

        await mongoose.connect(mongoURI)

        console.log('✅ MongoDB Connected Successfully')
        console.log(`📦 Database: ${mongoose.connection.name}`)
        
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error)
        process.exit(1)
    }

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB Disconnected')
    })

    mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB Error:', err)
    })
}

export default connectDB