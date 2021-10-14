const express = require('express');
const app = express();

const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const multer = require('multer');

const jwt = require("jsonwebtoken")

dotenv.config({ path: "./config.env" })

const port = process.env.PORT || 3000;

// middleware
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser())
app.use(express.json())


// serve static path 
app.use(express.static(path.join(__dirname, "assets")))

// add hbs engine
app.set("view engine", "hbs");

// set hbs views folders
const teplateView = path.join(__dirname, "templates/views")
app.set("views", teplateView)

// set partials folders
const teplatePartials = path.join(__dirname, "templates/partials")
hbs.registerPartials(teplatePartials)


// require database connections
require("./db/conn")

// rquire model
const messageModel = require("./model/schema")

// authenticate
const isAuthenticate = require("./authenticate")

isAuthenticate()
// image upload
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "./assets/upload")
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
    }
})

const uploads = multer(
    { storage: storage }
).single("file")


app.get("/", async (req, res) => {

    try {
        res.status(200).render("login")
    } catch (error) {
        res.status(404).json({ msg: "error to get page" })
    }
})

app.get("/chat_user", async (req, res) => {
    try {
        // console(req.rootUser);
        res.status(200).render("index")
    } catch (error) {
        res.redirect("/")
    }
})

app.get("/register", async (req, res) => {

    try {
        res.status(200).render("register")
    } catch (error) {
        res.status(404).json({ msg: "error to get page" })
    }
})

app.post("/register", uploads, async (req, res) => {

    try {
        const { name, email, about } = req.body
        const file = req.file.originalname

        if (!name || !email || !about || !file) {
            res.status(404).render("register", {
                data: "plase fill user details"
            })

        }
        else {
            console.log("emsai;")
            const alreadyUser = await messageModel.findOne({ email: email })
            if (alreadyUser) {
                res.status(404).render("register", {
                    data: "user already exist plase login"
                })
            }
            else {
                const saveTo = new messageModel({ name: name, email: email, about: about, file: file })
                const saveData = await saveTo.save();
                console.log(saveData)


                res.redirect("/")
            }

        }

    } catch (error) {
        res.status(404).json({ msg: "invalid credentials" })
    }
})


app.post("/login", async (req, res) => {

    try {
        const { name, email } = req.body

        if (!email || !name) {
            res.status(404).render("login", {
                data: "plase fill user email"
            })
        }
        else {

            const alreadyUser = await messageModel.findOne({ email: email, name: name })
            if (alreadyUser) {

                const token = await alreadyUser.authToken();

                res.cookie("jwToken", token, {
                    expires: new Date(Date.now() + 225892000000),
                    httpOnly: true
                })

                res.redirect("/chat_user")
            }
            else {
                res.redirect("/")

            }


        }


    } catch (error) {
        res.status(404).json({ msg: "invalid credentials" })
    }
})



app.listen(port, () => {
    console.log("server is running at port " + port);
})