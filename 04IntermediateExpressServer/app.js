// Setting Up the express
const express = require("express");
const app = express();

const port = 3000;



//Middleware
var myConsoleLog = (req,res, next) => {
    console.log("I am A Middleware");
    next();
}

var serverTime = (req, res, next)=> {
    req.requestTime = Date.now();
}
//Using a Middleware
app.use(myConsoleLog);
app.use(serverTime);

//Request
app.get("/", (req, res) => {
    res.send("Hello World " + " Server Time Is " + req.requestTime );
    console.log("Hello From /");
  });

//Listining and Port
app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
