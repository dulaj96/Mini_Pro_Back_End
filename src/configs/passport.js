/* eslint-disable no-undef */
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import User from '../models/User.js'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

const passportConfig = () => {
    // =======================================
    // Local Strategy
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            User.authenticate()
        )
    )
    passport.serializeUser(User.serializeUser())
    passport.deserializeUser(User.deserializeUser())

    // =======================================
    // JWT Strategy
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
    opts.secretOrKey = process.env.JWT_SECRET_KEY
    //opts.secretOrKey = process.env.JWT_ISSUER
    //opts.issuer = process.env.JWT_AUDIENCE

    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
             
                if (jwt_payload.expire <= Date.now()) {
                    return done(new Error('Token Expired'), null)
                }

          
                var user = jwt_payload

                if (user) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            } catch (error) {
                return done(error, false)
            }
        })
    )

    // Google Strategy

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL:
                    process.env.BASE_URL + '/api/v1/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, cb) => {
                try {
                    var { sub, name, email, picture, email_verified } =
                        profile._json
                    var user = await User.findOne({ email: email })
               
                    if (!user) {
                        user = await User.create({
                            email,
                            name,
                            photo: picture,
                            googleId: sub,
                            emailVerified: email_verified,
                        })
                    }
                    cb(null, user)
                } catch (error) {
                    return cb(error, false)
                }
            }
        )
    )
}

export default passportConfig
