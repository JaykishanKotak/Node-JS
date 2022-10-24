const express = require("express");
const ejs = require("ejs");
const multer = require("multer");
const path = require("path");

const app = express();

//Setup ejs
app.set("view engine", "ejs");
//Staic folder
app.use(express.static("./public"));

//Multer disk storage and settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/myupload");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        // Keeps file extantion same as upload
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
})

const upload = multer({
    storage: storage
}).single("profilepic");

//Desc
app.post("/upload", (req, res) => {
    upload(req, res, (error) => {
        if (error) {
            res.render("index", {
                message: error
            })
        } else {
            //Reload/Re-rander the page
            res.render("index", {
                message: "Successfully uploaded...",
                filename: `myupload/${req.file.filename}`
            });
        }
    })
})
//Render index file
app.use("/", (req, res) => {
    res.render("index");
})
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running at ${port}...`));