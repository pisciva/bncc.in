import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User, UserDoc } from '../../models/user'
import { message } from './messages'

const router = express.Router()

router.post("/login", async (req, res) => {
    const { email, password } = req.body as { email: string; password: string }

    try {
        const user: UserDoc | null = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: message.account_not_found })
        if (!user.password) return res.status(400).json({ message: message.social_login_only })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: message.invalid_credentials })

        const token = jwt.sign(
            { id: user._id, userId: user.userId },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        )

        res.json({ token })
    } catch (err) {
        res.status(500).json({ message: message.server_error })
    }
})

export default router
