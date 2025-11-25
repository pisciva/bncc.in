import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = express.Router()

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get("/google/callback",
    passport.authenticate("google", { 
        failureRedirect: `${FRONTEND_URL}/login?error=google_failed`,
        session: false 
    }),
    (req, res) => {
        if (!req.user) {
            console.log("No user found in req.user");
            return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
        }

        console.log("User from Google:", req.user);

        if (!process.env.JWT_SECRET) {
            console.log("JWT_SECRET missing");
            return res.status(500).send("Server misconfigured");
        }

        const user = req.user as { _id: string; userId: string }
        const token = jwt.sign(
            { id: user._id, userId: user.userId },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        )
        res.redirect(`${FRONTEND_URL}?token=${token}`)
    }
)


export default router