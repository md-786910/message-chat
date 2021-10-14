const mongoose = require('mongoose')

const uri = process.env.DATABASE_URI

mongoose.connect(uri, {

    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(() => {
    console.log('connected')
}).catch(err => {
    console.log("error not connected" + err)
})