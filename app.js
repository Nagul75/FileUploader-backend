const express = require('express')
const session = require('express-session')
const pool = require('./db/pool')
const passport = require('passport')
const indexRouter = require('./routers/indexRouter')
const pgStore = require('connect-pg-simple')(session)
const cors = require('cors')

const app = express()

const sessionStore = new pgStore({
    pool: pool,
    tableName: "User_sessions",
    createTableIfMissing: true
})

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    if(req.user) {
        res.locals.currentUser = req.user
        next()
    }
    next()
})

app.use("/", indexRouter)

app.listen(8080, () => {
    console.log("Server on PORT 8080")
})