const {Router} = require('express')
const passport = require('../auth/passport')
const indexController = require('../controllers/indexController')

const indexRouter = Router()

indexRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}))
indexRouter.post("/signup", indexController.signupPost)

module.exports = indexRouter