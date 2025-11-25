import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../../models/user'
import { message } from './messages'
import { capitalizeWords } from '../../utils/auth/capitalizeWords'

const router = express.Router()

router.post("/register", async (req, res) => {
    const { fullName, email, password } = req.body as {
        fullName: string
        email: string
        password: string
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: message.email_taken })
        }

        const lastUser = await User.findOne().sort({ userId: -1 })
        const newUserId = lastUser?.userId ? lastUser.userId + 1 : 1
        const hashedPassword = await bcrypt.hash(password, 10)
        const formattedFullName = capitalizeWords(fullName)

        const newUser = await User.create({
            userId: newUserId,
            fullName: formattedFullName,
            email,
            password: hashedPassword,
        })

        res.status(201).json({
            message: message.register_success,
            userId: newUser.userId,
        })
    } catch (err) {
        res.status(500).json({ message: message.register_failed })
    }
})

export default router