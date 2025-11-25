import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.get("/github",
    passport.authenticate("github", { scope: ["user:email"] })
)

router.get("/github/callback",
    passport.authenticate("github", { failureRedirect: "/login", session: false }),
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