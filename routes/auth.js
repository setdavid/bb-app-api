const express = require('express')
const bcrypt = require('bcrypt')
const { USERS } = require('../constants')
const router = express.Router()
require('dotenv').config()

//only used to generate hashed passwords!
router.get("/generate-hashed-password", async (req, res) => {
    const { password } = req.query

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword)
        res.status(200).json({ hashedPassword })
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.get("/login", async (req, res) => {
    const { username, password } = req.query
    let hashedPassword = null;

    if (username == process.env.USERNAME_1) {
        hashedPassword = process.env.PASSWORD_1
    } else if (username == process.env.USERNAME_2) {
        hashedPassword = process.env.PASSWORD_2
    }

    const failAuthError = {
        error: "Username or password does not match"
    }

    if (!hashedPassword) {
        res.status(401).json(failAuthError)
    } else {
        try {
            if (await bcrypt.compare(password, hashedPassword)) {
                res.status(200).json({ status: "good" })
            } else {
                res.status(401).json(failAuthError)
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    }
})

module.exports = router