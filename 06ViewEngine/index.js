const express = require("express");
const path = require("path");

let app = express();

var port = process.env.PORT || 3000;

// Views is the default folder for the templating
//Middlewares
// Set Dirc Name
app.set("views", path.join(__dirname, "views"));
// Set Engine Name
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => console.log("Sever is running ....."));
