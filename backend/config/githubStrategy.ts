import passport from 'passport'
import { Strategy as GitHubStrategy, Profile } from 'passport-github2'
import { User } from '../models/user'

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            callbackURL: 'http://localhost:5000/auth/github/callback',
        },
        async ( accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void ) => {
            try {
                const email = profile.emails?.[0]?.value || `${profile.username} (github)`
                let user = await User.findOne({ email })

                if (!user) {
                    const lastUser = await User.findOne().sort({ userId: -1 })
                    const newUserId = lastUser && lastUser.userId ? parseInt(String(lastUser.userId)) + 1 : 1

                    user = await User.create({
                        userId: newUserId,
                        fullName: profile.displayName || profile.username,
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