/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
*  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Stephen Ward Student ID: 118862168 Date: 06/22/2017
*  Online (Heroku) Link:  https://intense-everglades-43152.herokuapp.com/
*
********************************************************************************/

var express = require('express');
var app = express();
var path = require('path');
var HTTP_PORT = process.env.PORT || 8080;
var dataModule = require('./data-service.js');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const dataServiceComments = require('./data-service-comments.js');

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
  dataServiceComments.getAllComments().then((dataFromPromise) => {
    res.render("about", {data: dataFromPromise});
  }).catch(() => {
    res.render("about");
  });
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
  let viewData = {};

  dataModule.getEmployeeByNum(req.params.empNum).then((data) => {
    viewData.data = data;
  }).catch((err) => {
    viewData.data = null;
  }).then(dataModule.getDepartments).then((data) => {
    viewData.departments = data;
    for (let i = 0; i < viewData.departments.length; i++) {
      if (viewData.departments[i].departmentID == viewData.data.department) {
        viewData.departments[i].selected = true;
      }
    }
  }).catch(() => {
    viewData.departments = [];
  }).then(() => {
    if (viewData.data == null) {
      res.status(404).send("Employee not found");
    } else {
      res.render("employee", { viewData: viewData });
    }
  });
});

app.get('/department/:departmentNum', (req, res) => {
  dataModule.getDepartmentById(req.params.departmentNum).then((data) => {
    res.render("department", { data: data });
  }).catch((err) => {
    res.status(404).send("Department not found");
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
  dataModule.getDepartments().then((data) => {
    res.render("addEmployees", { departments: data });
  }).catch((err) => {
    res.render("addEmployees", { departments: [] });
  });
});

app.get("/departments/add", (req, res) => {
  res.render("addDepartments");
});

app.get("/employee/delete/:empNum", (req, res) => {
  dataModule.deleteEmployeeByNum(req.params.empNum).then(() => {
    res.redirect("/employees")
  }).catch(() => {
    res.status(500).send("Unable to Remove Employee / Employee not found");
  });
});

app.post("/employees/add", (req, res) => {
  dataModule.addEmployees(req.body).then(() => {
    res.redirect("/employees");
  });
});

app.post("/departments/add", (req, res) => {
  dataModule.addDepartment(req.body).then(() => {
    res.redirect("/departments");
  });
});

app.post("/employee/update", (req, res) => {
  dataModule.updateEmployee(req.body).then(() => {
    res.redirect("/employees");
  });
});

app.post("/departments/update", (req, res) => {
  dataModule.updateDeparment(req.body).then(() => {
    res.redirect("/departments");
  });
});

app.post("/about/addComment", (req, res) => {
  dataServiceComments.addComment(req.body).then(() => {
    console.log("here we are");
    res.redirect("/about");
  })
    .catch((err) => {
      console.log(err);
      res.redirect("/about");
    });
});

app.post("/about/addReply", (req, res) => {
  dataServiceComments.addReply(req.body).then(() => {
    res.redirect("/about");
  })
    .catch((err) => {
      console.log(err);
      res.redirect("/about");
    });
});



app.use((req, res, next) => {
  res.status(404).send("Page Not Found");
});


dataModule.initialize().then(() => {
  dataServiceComments.initialize();
}).then(() => {
  app.listen(HTTP_PORT, (req, res) => {
    console.log("Express http server listing on " + HTTP_PORT);
  });
}).catch((err) => {
  res.json({ message: err });
});


