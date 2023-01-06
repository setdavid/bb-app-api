const express = require('express')
const app = express()

app.use(express.json())

const authRouter = require("./routes/auth")

app.listen(8080)
app.use("/auth", authRouter)