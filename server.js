require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")

// Route imports
const authRoute = require("./routes/auth")
const toDosRoutes = require("./routes/todos")
const app = express()


app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoute)
app.use("/api/todos", toDosRoutes)

app.get("/api", (req, res) => {
    res.send("Welcome to the backend of Todos App")
})

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to the database");

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    })
}).catch((error) => {
    console.log(error);
})