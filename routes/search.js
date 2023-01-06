// const express = require('express')
// const axios = require('axios')
// const router = express.Router()

// router.get("/", async (req, res) => {
//     let requestOptions = {
//         url: `https://api.spotify.com/v1/search`,
//         method: "GET",
//         headers: {
//             "Authorization": `Bearer ${req.query.access_token}`,
//             "Content-Type": "application/json"
//         },
//         params: {
//             "q": req.query.q,
//             "type": "track"
//         }
//     }

//     try {
//         const response = await axios(requestOptions)
//         let data = response.data
//         console.log(data)
//         res.json(data)
//     } catch (err) {
//         console.log(err);
//         res.json(err)
//     }
// })

// module.exports = router