//Imports
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { unescape } = require("querystring");
const { hostname } = require("os");

// File Types that allowed on server
const mineTypes = {
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  png: "image/png",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
};

const hostName = "127.0.0.1";
const port = 5000;

http
  .createServer((req, res) => {
    var myuri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), unescape(myuri));
    console.log(`File we're looking for is => ${filename}`);
    try {
      var loadfile = fs.lstatSync(filename);
    } catch (error) {
      //console.log(error);
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("404 page not found");
      res.end();
      return;
    }
    if (loadfile.isFile()) {
      // Returns an Array with type
      var mineType = mineTypes[path.extname(filename).split(".").reverse()[0]];
      res.writeHead(200, { "Content-Type": mineType });
      var fileStream = fs.createReadStream(filename);
      fileStream.pipe(res);
    } else if (loadfile.isDirectory()) {
      res.writeHead(302, { Location: "index.html" }); // Directory Exists
      res.end();
    } else {
      res.writeHead(500, {
        "Content-Type": "text/plain", // For Postman
      });
      res.write("500 Internal Error"); // For WebPage
      res.end();
    }
  })
  .listen(port, hostname, () => {
    console.log(`server is running on port: ${port}`);
  });
