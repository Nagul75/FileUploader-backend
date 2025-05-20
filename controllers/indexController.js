const {body, validationResult} = require('express-validator')
const {PrismaClient} = require('../generated/prisma')
const passport = require('../auth/passport')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const alphError = "must only contain alphabets"

const validateUser = [
    body("fullname").trim()
    .isAlpha('en-US', {ignore: ' '}).withMessage("Fullname" + alphError)
    .isLength({min: 1, max: 255}).withMessage("Fullname must be between 1 and 255 characters"),

    body("username").trim()
    .isAlpha().withMessage("Username" + alphError)
    .isLength({min: 1, max: 255}).withMessage("Username must be between 1 and 255 characters"),

    body("password").isLength({min: 1}).withMessage("Password must be minimum 3 characters"),

    body("passwordConfirmation").custom((value, {req}) => {
        return value === req.body.password
    }).withMessage("Password confirmation not same as password"),

    body("email").isEmail().withMessage("Invalid email")
]

const signupPost = [
    validateUser,
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(401).json({success: false, errors: errors.array()})
        }
        try {
            req.body.password = await bcrypt.hash(req.body.password, 10)
            const alreadyExists = await prisma.user.findUnique({
                where: {
                    email: req.body.email
                }
            })
            if(alreadyExists) {
                throw new Error("Email already exists")
            }
            const user = await prisma.user.create({
                data: {
                    fullname: req.body.fullname,
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password
                }
            })
            if(!user){ throw new Error("Error creating user") }
            res.status(201).json({success: true, message: "User created successfully!"})
        }
        catch(err) {
            return res.status(401).json({success: false, message: err.message || "Some error!"})
        }
    }
]

async function loginPost(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
        if(err) return next(err)
        
        if(!user) {
            return res.status(401).json({
                success: false,
                message: info?.message || "Invalid credentials"
            })
        }
        req.login(user, (err) => {
            if(err) return next(err)
            
            return res.json({
                success: true,
                message: "Login successful!",
                user: {
                    id: user.user_id,
                    email: user.email,
                    fullname: user.fullname,
                }
            })
        })
    })(req, res, next);
}

module.exports = {
    signupPost,
    loginPost
}