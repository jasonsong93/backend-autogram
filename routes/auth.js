const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const validateRegisterInput = require("../validation/registerValidation")
const jwt = require("jsonwebtoken")
const requiresAuth = require("../middleware/permissions")

//  @route      GET /api/auth/test
//  @desc       Test the auth route
//  @access     Public
router.get("/test", (req, res) => {
    res.send("Auth working")
})


//  @route      GET /api/auth/register
//  @desc       Create a new user
//  @access     Public
router.post("/register", async (req, res) => {
    try {
        const { errors, isValid } = validateRegisterInput(req.body)

        if (!isValid) {
            return res.status(400).json(errors)
        }

        // Check for existing user
        const existingEmail = await User.findOne({ email: req.body.email })

        if (existingEmail) {
            return res.status(400).json({ error: "There is already a user with this email" })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 12)
        // Create a new uesr
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
        })
        // Save the user to the DB
        const savedUser = await newUser.save()

        // Create a user to return in JSON
        const userToReturn = { ...savedUser._doc }
        delete userToReturn.password

        // Return the new user
        return res.json(userToReturn)
    } catch (err) {
        console.log(err);
        res.send(500).send(err.message)
    }
})

//  @route      GET /api/auth/login
//  @desc       Login user and return access token 
//  @access     Public
router.post("/login", async (req, res) => {
    try {
        // Check the user exists
        const user = await User.findOne({
            email: req.body.email
        })

        if (!user) {
            return res
                .status(400)
                .json({ error: "Login error, please ensure email and password are correct" })
        }

        // Check passwords match 
        const passwordMatch = await bcrypt.compare(req.body.password, user.password)

        if (!passwordMatch) {
            return res
                .status(400)
                .json({ error: "Login error, please ensure email and password are correct" })
        }

        // Passwords have matched, handle payload
        const payload = { userId: user._id }
        // Note that the token can easily read the payload, BUT it's difficult to manipulate
        // therefore, we can see if it is invalid or been tampered with (trying to pretend to be someone else)
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("access-token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        })
        
        const userToReturn = { ...user._doc }
        delete userToReturn.password

        return res.json({
            token: token,
            user: userToReturn,
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})


//  @route      GET /api/auth/current
//  @desc       Return the currently authed user 
//  @access     Private
router.get("/current", requiresAuth, (req, res) => {
    if(!req.user) {
        return res.status(401).send("Unauthorized")
    }

    return res.json(req.user)
})

module.exports = router;