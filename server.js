/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
*  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Stephen Ward Student ID: 118862168 Date: 06/22/2017
*  Online (Heroku) Link:  https://intense-everglades-43152.herokuapp.com/
*
********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;
var dataModule = require('./data-service.js');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.engine(".hbs", exphbs({
  extname: ".hbs",
  defaultLayout: 'layout',
  helpers: {
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }

}));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/employees", (req, res) => {

  if (req.query.status) {
    dataModule.getEmployeesByStatus(req.query.status).then((data) => {
      res.render("employeeList", { data: data, title: "Employees" });
    }).catch((err) => {
      res.json({ message: err });
    });

  } else if (req.query.department) {
    dataModule.getEmployeesByDepartment(req.query.department).then((data) => {
      res.render("employeeList", { data: data, title: "Employees" });
    }).catch((err) => {
      res.json({ message: err });
    });

  } else if (req.query.manager) {
    dataModule.getEmployeesByManager(req.query.manager).then((data) => {
      res.render("employeeList", { data: data, title: "Employees" });
    }).catch((err) => {
      res.json({ message: err });
    });
    //if there are no options, display all the employees
  } else {
    dataModule.getAllEmployees().then((data) => {
      res.render("employeeList", { data: data, title: "Employees" });
    });
  }
});

app.get('/employee/:empNum', (req, res) => {
  dataModule.getEmployeeByNum(req.params.empNum).then((data) => {
    res.render("employee", { data: data });
  }).catch((err) => {
    res.status(404).send("Employee not found");
  });
});

app.get("/managers", (req, res) => {
  dataModule.getManagers().then((data) => {
    res.render("employeeList", { data: data, title: "Employees (Managers)" });
  }).catch((err) => {
    res.render("employeeList", { data: {}, title: "Employees (Managers)" });
  });
});

app.get("/departments", (req, res) => {
  dataModule.getDepartments().then((data) => {
    res.render("departmentList", { data: data, title: "Departments" });
  }).catch((err) => {
    res.render("departmentList", { data: {}, title: "Departments" });
  });
});

app.get("/employees/add", (req, res) => {
  res.render("addEmployees");
});

app.post("/employees/add", (req, res) => {
  dataModule.addEmployees(req.body).then(() => {
    res.redirect("/employees");
  });
});

app.post("/employee/update", (req, res) => {
  dataModule.updateEmployee(req.body).then(() => {
    res.redirect("/employees");
  });
});

app.use((req, res, next) => {
  res.status(404).send("Page Not Found");
});

dataModule.initialize().then(() => {
  app.listen(HTTP_PORT, (req, res) => {
    console.log("Express http server listing on " + HTTP_PORT);
  });
}).catch((err) => {
  res.json({ message: err });
});

