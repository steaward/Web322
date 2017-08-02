/*********************************************************************************
*  WEB322 – Assignment 07
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
*  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Stephen Ward Student ID: 118862168 Date: 07/31/2017
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
const clientSessions = require('client-sessions');
const dataServiceAuth = require('./data-service-auth.js')

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
};



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(clientSessions({
  cookieName: "session",
  secret: "assignment7ex",
  duration: 2 * 60 * 2000,
  activeDuration: 1000 * 60
}));

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});


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
    res.render("about", { data: dataFromPromise });
  }).catch(() => {
    res.render("about");
  });
});

app.get("/employees", ensureLogin, (req, res) => {

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

app.get('/employee/:empNum', ensureLogin, (req, res) => {
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

app.get('/department/:departmentNum', ensureLogin, (req, res) => {
  dataModule.getDepartmentById(req.params.departmentNum).then((data) => {
    res.render("department", { data: data });
  }).catch((err) => {
    res.status(404).send("Department not found");
  });
});

app.get("/managers", ensureLogin, (req, res) => {
  dataModule.getManagers().then((data) => {
    res.render("employeeList", { data: data, title: "Employees (Managers)" });
  }).catch((err) => {
    res.render("employeeList", { data: {}, title: "Employees (Managers)" });
  });
});

app.get("/departments", ensureLogin, (req, res) => {
  dataModule.getDepartments().then((data) => {
    res.render("departmentList", { data: data, title: "Departments" });
  }).catch((err) => {
    res.render("departmentList", { data: {}, title: "Departments" });
  });
});

app.get("/employees/add", ensureLogin, (req, res) => {
  dataModule.getDepartments().then((data) => {
    res.render("addEmployees", { departments: data });
  }).catch((err) => {
    res.render("addEmployees", { departments: [] });
  });
});

app.get("/departments/add", ensureLogin, (req, res) => {
  res.render("addDepartments");
});

app.get("/employee/delete/:empNum", ensureLogin, (req, res) => {
  dataModule.deleteEmployeeByNum(req.params.empNum).then(() => {
    res.redirect("/employees")
  }).catch(() => {
    res.status(500).send("Unable to Remove Employee / Employee not found");
  });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  dataServiceAuth.registerUser(req.body)
  .then(() => {
    res.render("register", {successMessage: "User Created"})
  }).catch((err)=>{
    res.render("register", {errorMessage: err, user:req.body.user});
  });
});

app.post("/login", (req, res) => {
  dataServiceAuth.checkUser(req.body)
  .then(() => {
    req.session.user = {
      user: req.body.user
    }
    res.render("employee");
  }).catch((err) => {
      res.render("login", {errorMessage: err, user: req.body.user});
  });
});

app.post("/employees/add", ensureLogin, (req, res) => {
  dataModule.addEmployees(req.body).then(() => {
    res.redirect("/employees");
  });
});

app.post("/departments/add", ensureLogin, (req, res) => {
  dataModule.addDepartment(req.body).then(() => {
    res.redirect("/departments");
  });
});

app.post("/employee/update", ensureLogin, (req, res) => {
  dataModule.updateEmployee(req.body).then(() => {
    res.redirect("/employees");
  });
});

app.post("/departments/update", ensureLogin, (req, res) => {
  dataModule.updateDeparment(req.body).then(() => {
    res.redirect("/departments");
  });
});

app.post("/about/addComment", (req, res) => {
  dataServiceComments.addComment(req.body).then(() => {
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



dataModule.initialize()
  .then(dataServiceComments.initialize)
  .then(dataServiceAuth.initialize)
  .then(() => {
    app.listen(HTTP_PORT);
      console.log("Express http server listing on " + HTTP_PORT);
  }).catch((err) => {
    console.log("unable to start server");
  });


