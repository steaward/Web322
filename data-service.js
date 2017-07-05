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
    employeeManagerNum: {
        type: Sequelize.INTEGER,
        defaultValue: null
    },
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Departents = sequelize.define('Departments', {
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
        Employees.findAll({
            where: {
                status: status
            }
        }).then(function (employees) {
            resolve(employees);
        }).catch(() => {
            reject('No employees found...');
        });
    });
};

module.exports.getEmployeesByDepartment = (department) => {
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where: {
                department: department
            }
        }).then(function (employees) {
            resolve(employees)
        }).catch(() => {
            reject('No employees found...')
        });
    });
};
module.exports.getEmployeesByManager = (managerId) => {
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where: {
                employeeManagerNum: managerId
            }
        }).then(function (employees) {
            resolve(employees);
        }).catch(() => {
            reject('No employees found...');
        });
    });
};

module.exports.getEmployeeByNum = (num) => {
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where: {
                employeeNum: num
            }
        }).then(function (employees) {
            resolve(employees[0]);
        }).catch(() => {
            reject('No employees found...');
        });
    });
};

module.exports.getManagers = () => {
    return new Promise(function (resolve, reject) {
        Employess.findAll({
            where: {
                isManager: true
            }
        }).then(function (employees) {
            resolve(employees);
        }).catch(() => {
            reject('No employees found...');
        });
    });
};

module.exports.getDepartments = () => {
    return new Promise(function (resolve, reject) {
        Departments.findAll().then(function (departments) {
            resolve(departments);
        }).catch(() => {
            reject('No departments found...');
        });
    });
};


module.exports.addEmployees = function (employeeData) {
    return new Promise(function (resolve, reject) {
        //check and set bool for isManager
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var prop in employeeData) {
            if (employeeData[prop] == ' ') {
                employeeData[prop] = null;
            }
        }
        Employees.create({
            firstName: employeeData.firstName,
            last_name: employeeData.last_name,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            martialStatus: employeeData.martialStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }).then(() => {
            resolve();
        }).catch(() => {
            reject("unable to create employee");
        });
    });
};

module.exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        //check and set bool for isManager
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var prop in employeeData) {
            if (employeeData[prop] == ' ') {
                employeeData[prop] = null;
            }
        }
        Employees.update({
            firstName: employeeData.firstName,
            last_name: employeeData.last_name,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            martialStatus: employeeData.martialStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }, {
                where:
                { employeeNum: employeeData.employeeNum }

            }).then(() => {
                resolve();
            }).catch(() => {
                reject("unable to create employee");
            });
    });
};


