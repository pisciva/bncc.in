import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: false }),
    (req, res) => {
        const user = req.user as { _id: string; userId: string }
        const token = jwt.sign(
            { id: user._id, userId: user.userId },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        )
        res.redirect(`http://localhost:3000?token=${token}`)
    }
)

export default router