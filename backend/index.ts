import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

import './config/passport'

// connect MongoDB
import { connectDB } from './config/connection'

// ⚠️ PERBAIKAN: Validasi environment variables
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
    console.error('❌ ERROR: MONGODB_URI or MONGO_URI is not defined!')
    process.exit(1)
}

if (!process.env.FRONTEND_URL) {
    console.error('❌ ERROR: FRONTEND_URL is not defined!')
    process.exit(1)
}

connectDB()

// middleware
// ⚠️ PERBAIKAN: Allow multiple origins untuk dev dan production
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'https://celebrated-gratitude-production.up.railway.app'
].filter(Boolean) // Remove undefined values

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true)
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            console.log('❌ CORS blocked origin:', origin)
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// ⚠️ PENTING: Handle preflight requests
app.options('*', cors())

app.use(express.json())
app.set('trust proxy', true)

// ⚠️ PERBAIKAN: Session cookie configuration untuk production
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}))

app.use(passport.initialize())
app.use(passport.session())

// ⚠️ TAMBAHAN: Logging middleware untuk debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        origin: req.headers.origin,
        contentType: req.headers['content-type']
    })
    next()
})

app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'BNCC.in API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    })
})

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        cors: allowedOrigins,
        timestamp: new Date().toISOString()
    })
})

// routes
import authRoutes from './routes/auth/auth'
import passwordRoutes from './routes/auth/password'
import linkRoutes from './routes/main/link'
import qrRoutes from './routes/main/qr'
import redirectRoutes from './routes/main/redirect'
import analyticsRoutes from './routes/main/analytics'

app.use(authRoutes)
app.use(passwordRoutes)
app.use('/api/links', linkRoutes)
app.use('/api/qrs', qrRoutes)
app.use('/api/redirect', redirectRoutes)
app.use('/api/analytics', analyticsRoutes)

// ⚠️ TAMBAHAN: Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('❌ Error:', err.message)
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        path: req.path
    })
})

// ⚠️ TAMBAHAN: 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
        method: req.method
    })
})

app.listen(PORT, () => {
    console.log(`🚀 Server running → http://localhost:${PORT}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 Allowed origins:`, allowedOrigins)
})

export default app