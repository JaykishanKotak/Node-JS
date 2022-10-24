// Setting Up the express
const express = require("express");
const app = express();

const port = 3000;

//Request
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/about", (req, res) => {
  res.send("<h1> Hello From the About Page</h1>");
});

//Create Router for contact and services(simple unorder list)
app.get("/contact", (req, res) => {
  res.send("<h1>Contact Page</h1>");
});

app.get("/about-us", (req, res) => {
  //res.send("<h1>About Us Page</h1>");
  res.status(200).json({ user: "baburao", balance: "2500", id: "stargerage" });
  //res.status(500).json({ error: "Something went wrong" });
});

app.get("/user/:id/status/:status_id", (req, res) => {
  res.send(req.params);
  // Retruns JSON Object
  // Test Ex:- http://localhost:3000/user/123/status/123
});

app.get("/flights/:from-:to", (req, res) => {
  res.send(req.params);
  // Retruns JSON Object
  //Test Ex :- http://localhost:3000/flights/AHD-SF
});

app.get("/ab*cd", (req, res) => {
  // Here * respresent any value between start with ab and ends with cd
  res.send("<h1>Regax Page</h1>");
});

app.get("/service", (req, res) => {
  res.send("<h1>Service Page</h1> <br /> <ul><li>call</li> <li>mail</li></ul>");
});

app.post("/login", (req, res) => {
  res.send("Login Success");
});

//delete route and test with postman
app.delete("/delete", (req, res) => {
  res.send("Delete Success");
});

//Listining and Port
app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
