const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { EXPIRES_IN } = require('../constants')
const router = express.Router()
require('dotenv').config()

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: `${EXPIRES_IN}s` })
}

const authenticateAccessToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const accessToken = authHeader ? authHeader.split(" ")[1] : null

    if (accessToken == null) {
        res.status(400).json({ error: "MISSING_ACCESS_TOKEN" })
    } else {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    res.status(401).json({ error: "EXPIRED_ACCESS_TOKEN" })
                } else {
                    res.status(401).json({ error: "INVALID_ACCESS_TOKEN" })
                }
            } else {
                req.user = user
                next()
            }
        })
    }
}

//only used to generate hashed passwords!
router.post("/generate-hashed-password", async (req, res) => {
    const { password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        res.status(200).json({ hashedPassword })
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body
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
                const user = { username }
                const accessToken = generateAccessToken(user)
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                res.status(200).json({ access_token: accessToken, refresh_token: refreshToken, expires_in: EXPIRES_IN })
            } else {
                res.status(401).json(failAuthError)
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    }
})

router.post("/refresh", (req, res) => {
    const refreshToken = req.body.refresh_token

    if (refreshToken == null) {
        res.status(400).json({ error: "MISSING_REFRESH_TOKEN" })
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    res.status(401).json({ error: "EXPIRED_REFRESH_TOKEN" })
                } else {
                    res.status(401).json({ error: "INVALID_REFRESH_TOKEN" })
                }
            } else {
                const userObj = { username: user.username }
                const accessToken = generateAccessToken(userObj)
                res.status(200).json({ access_token: accessToken, refresh_token: refreshToken, expires_in: EXPIRES_IN })
            }
        })
    }
})

router.post("/test", authenticateAccessToken, async (req, res) => {
    res.json(req.user)
})


module.exports = router