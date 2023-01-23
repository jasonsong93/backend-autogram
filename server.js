require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")

// Route imports
const authRoute = require("./routes/auth")

const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

app.get("/api", (req, res) => {
    res.send("Working with the get request")
})

app.use("/api/auth", authRoute)

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to the database");

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    })
}).catch((error) => {
    console.log(error);
})