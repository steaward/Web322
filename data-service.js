const Sequelize = require('sequelize');
var sequelize = new Sequelize('d72jgn62vtte9k', 'gaommmbqzmlmsi', '76ff31a72e17561cea8e989ef8691eebd299c6f9ccef2fe3ff6fc5ccd2e849cd',
    {
        host: 'ec2-23-21-246-11.compute-1.amazonaws.com',
        dialect: 'postgres',
        port: 5432,
        dialectOptions: {
            ssl: true
        }
    });

 var Employees = sequelize.define('Employees', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    martialStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Departents = sequelize.define('Departments',{
    departmentID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

module.exports.initialize = () => {
        return new Promise(function (resolve, reject) {
            sequelize.sync().then(() => {
                resolve('Connected to the database!');
            }).catch(() => {
                reject('Unable to connect to the database...');
            });
        });
    };

module.exports.getAllEmployees = () => {
    return new Promise(function (resolve, reject) {
        Employees.findAll().then((Employees) => {
            resolve(Employees);
        }).catch(() => {
            reject('No employees found...');
        });
    });
};

module.exports.getEmployeesByStatus = (status) => {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getEmployeesByDepartment = (department) => {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getEmployeesByManager = (managerId) => {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getEmployeeByNum = (num) => {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getManagers = () => {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getDepartments = () => {
    return new Promise(function (resolve, reject) {
        if (departments.length > 0) {
            resolve(departments);
        } else {
            reject("No results returned");
        }
    });

};

module.exports.addEmployees = function (employeeData) {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        reject();
    });
};



