import express from 'express'
import authMiddleware from '../../middleware/authMiddleware'

import loginAuth from './loginAuth'
import manualAuth from './manualAuth'
import googleAuth from './googleAuth'
import githubAuth from './githubAuth'

const router = express.Router()

router.use("/auth", loginAuth)
router.use("/auth", manualAuth)
router.use("/auth", googleAuth)
router.use("/auth", githubAuth)

router.get("/api/auth/me", authMiddleware, (req, res) => {
    res.json({ user: req.user })
})

export default router
