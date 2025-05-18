const {Router} = require('express')
const indexController = require('../controllers/indexController')

const indexRouter = Router()

indexRouter.post("/login", indexController.loginPost)
indexRouter.post("/signup", indexController.signupPost)

module.exports = indexRouter