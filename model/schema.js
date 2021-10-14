const mongoose = require('mongoose')

const jwt = require("jsonwebtoken")

const messageSchema = new mongoose.Schema({
    name: {
        type: String,


    },
    email: {
        type: String,


    },
    about: {
        type: String,


    },
    file: {
        type: String,

    },
    tokens: [
        {
            token: {
                type: String,
            }
        }
    ]

})


messageSchema.methods.authToken = async function () {
    try {

        let token = await jwt.sign({ id: this._id }, process.env.SECKEY_KEY)
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token

    } catch (error) {
        console.log(error);
    }

}

const messageModel = new mongoose.model("messageModel", messageSchema)

module.exports = messageModel;