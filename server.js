const express = require('express')
const app = express()

app.use(express.json())

// const accessRouter = require("./routes/access")

app.listen(8080)
// app.use("/access", accessRouter)