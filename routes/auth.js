const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const validateRegisterInput = require("../validation/registerValidation")

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
        
        if(!isValid) {
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
        // Return the new user
        return res.json(savedUser)
    } catch (err) {
        console.log(err);
        res.send(500).send(err.message)
    }
})

module.exports = router;