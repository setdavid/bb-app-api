const express = require('express')
const bcrypt = require('bcrypt')
const { USERS } = require('../constants')
const router = express.Router()

//only used to create hashed passwords!
router.get("/create-user", async (req, res) => {
    const { username, password } = req.query

    if (USERS.find(user => user.username == username)) {
        res.status(400).json({
            error: "Username taken"
        })
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            console.log(hashedPassword)
            res.status(200).json({ hashedPassword })
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    }
})

router.get("/login", async (req, res) => {
    const { username, password } = req.query
    const user = USERS.find(user => user.username == username)

    const failAuthError = {
        error: "Username or password does not match"
    }

    if (!user) {
        res.status(401).json(failAuthError)
    } else {
        try {
            if (await bcrypt.compare(password, user.password)) {
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