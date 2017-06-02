/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
*  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Stephen Ward Student ID: 118862168 Date: 05/26/2017
*  Online (Heroku) Link:  https://intense-everglades-43152.herokuapp.com/
*
********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;
var dataModule = require('./data-service.js');

app.use(express.static('public'));


app.get("/", (req, res) => {
 res.sendFile(path.join(__dirname, './views', 'home.html'));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, './views', 'about.html'));
});

app.get("/employees", (req, res) => {
 
  if(req.query.status){
    res.send(req.query.status);

  }else if(req.query.department){
    res.send(req.query.department);

  }else if (req.query.manager){
    res.send(req.query.manager);
  }else {
   dataModule.getAllEmployees().then((data) => {
     res.json(data);
   });
  }
});

app.get("employee/:empNum", (req, res) => {


res.json(req.params.empNum);

});

app.get("/managers", (req, res) => {
  
  res.send("managers");

});

app.get("/departments", (req,res) => {

res.send("departments");
});

app.use((req, res, next) =>{
  res.status(404).send("Page Not Found");
  
});

dataModule.initialize().then( () =>{
  app.listen(HTTP_PORT,(req, res) => {
    console.log("Express http server listing on " + HTTP_PORT);
  });
}).catch((err) => {
    res.send(err);
});

