const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const {PrismaClient} = require('../generated/prisma')

const prisma = new PrismaClient()

passport.use(new LocalStrategy({usernameField: 'email'},
    async (email, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                }
            }) //find user in database
            if(!user) {
                return done(null, false, {message: "Incorrect email"}) //return if user doesn't exist
            }

            //compare hashed password in db with new hashed password input
            const match = await bcrypt.compare(password, user.password)
            if(!match) {
                return done(null, false, {message: "Incorrect password"})
            }
            return done(null, user) //if successful, return with user object
        }
        catch(err) {
            done(err)
        }
    }
))

/* User logs in
 * passport calls serializeUser(user)
 * Stores user.id in session cookie
 */
passport.serializeUser((user, done) => {
    done(null, user.user_id)
})

/* User makes new request
 * Passport reads session cookie -> finds id
 * passport calls deserializeUser(id)
 * Prisma loads user from DB
 * req.user is now populated
 */

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                user_id: id
            }
        })
        done(null, user)
    }
    catch(err) {
        done(err)
    }
})

module.exports = passport