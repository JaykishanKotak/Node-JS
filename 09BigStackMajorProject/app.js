const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth = require("./routes/api/auth.js");
const questions = require("./routes/api/questions");
const profile = require("./routes/api/profile");
const passport = require("passport")

const app = express();

//CORS 
app.use(cors());
//Middleware for body-pasrse
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());

//Bring all routes
//const auth = require('./routes/api/auth.js')
//mongodb config
const dbURL = require("./setup/myuri.js").mongoURL;

//Passport Middleware
app.use(passport.initialize());

//Congif For JWT Strategy
require("./strategies/jwtStrategy")(passport);

//Connect to DB
mongoose.connect(dbURL).then(() => {
        console.log("MongoDB Connected")
    })
    .catch((err) => {
        console.log(`Error : ${err}`);
    }), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    };


const PORT = process.env.PORT || 3000;

//Testing Routes
//app.get('/', (req, res) => {
//res.send("Hello World")
//})

//Auth Route
app.use('/api/auth', auth);
app.use('/api/profile', profile)
app.use('/api/questions', questions)

app.listen(PORT, () => {
    console.log(`App is listing on PORT ${PORT}`);
})