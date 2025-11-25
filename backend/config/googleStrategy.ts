import passport from 'passport'
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20'
import { User } from '../models/user'

const callbackURL = process.env.NODE_ENV === 'production'
    ? `${process.env.BACKEND_URL}/auth/google/callback`
    : 'http://localhost:5000/auth/google/callback'

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL,
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
            try {
                const email = profile.emails?.[0]?.value
                if (!email) return done(new Error('No email from Google'), null)

                let user = await User.findOne({ email })

                if (!user) {
                    const lastUser = await User.findOne().sort({ userId: -1 })
                    const newUserId = lastUser?.userId ? parseInt(String(lastUser.userId)) + 1 : 1

                    user = await User.create({
                        userId: `${newUserId}`,
                        fullName: profile.displayName || 'Google User',
                        email,
                        password: '',
                    })
                }

                done(null, user)
            } catch (err) {
                done(err, null)
            }
        }
    )
)