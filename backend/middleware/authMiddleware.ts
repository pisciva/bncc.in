import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '../models/user'

declare module 'express-serve-static-core' {
    interface Request {
        user?: any | null
    }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next()
    }

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null
        return next()
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        const user = await User.findById(decoded.id).select('-password')

        if (!user) {
            req.user = null
        } else {
            req.user = user
        }

        next()
    } catch (error) {
        req.user = null
        next()
    }
}

export default authMiddleware