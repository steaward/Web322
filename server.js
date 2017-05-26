/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
*  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Stephen Ward Student ID: 118862168 Date: 05/26/2017
*  Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get("/", (req, res) => {
 res.sendFile(path.join(__dirname, './views', 'home.html'));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, './views', 'about.html'));
});

app.listen(HTTP_PORT,(req, res) => {
  console.log("Express http server listing on " + HTTP_PORT);
});

