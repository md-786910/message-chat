const jwt = require("jsonwebtoken")
const messageModel = require("../model/schema")

async function isAuthenticate(req, res, next) {
    try {
        let token = req.cookies.jwToken;

        const verifyToken = await jwt.verify(token, process.env.SECRET_KEY)

        if (verifyToken) {
            const rootUser = await messageModel.findOne({ id: verifyToken._id, "tokens.token": token })

            req.token = token
            req.rootUser = rootUser
            req.userId = rootUser._id
            next()
        }
        else {
            res.status(404).send("invalid token rootUser")

        }

    } catch (error) {
        res.status(404).json({ msg: "not auth user" })
    }

}

module.exports = isAuthenticate