import passport from 'passport'
import { Strategy as GitHubStrategy, Profile } from 'passport-github2'
import { User } from '../models/user'

const callbackURL = process.env.NODE_ENV === 'production'
    ? `${process.env.FRONTEND_URL}/auth/github/callback`
    : 'http://localhost:5000/auth/github/callback'

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            callbackURL,
            scope: ['user:email'],
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
            try {
                const email = profile.emails?.[0]?.value
                if (!email) return done(new Error('GitHub email required'), null)

                let user = await User.findOne({ email })

                if (!user) {
                    const lastUser = await User.findOne().sort({ userId: -1 })
                    const newUserId = lastUser?.userId ? parseInt(String(lastUser.userId)) + 1 : 1

                    user = await User.create({
                        userId: newUserId,
                        fullName: profile.displayName || profile.username || 'GitHub User',
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