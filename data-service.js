
const fs = require('fs');

var employees = [];
var departments = [];

module.exports.initialize = () => {
    var i = 0;
    var fail = false;
    return new Promise(function (resolve, reject) {
        fs.readFile('./data/employees.json', (err, data) => {
            if (err) {
                fail = true;
            } else {
                employees = JSON.parse(data);
            }
        });

        fs.readFile('./data/departments.json', (err, data) => {
            if (err) {
                fail = true;

            } else {
                departments = JSON.parse(data);
            }
        });

        if (fail == true) {
            reject("Did not open");
        } else {
            resolve();
        }
    });
};

module.exports.getAllEmployees = () => {
    return new Promise(function (resolve, reject) {
        if (employees.length > 0) {
            resolve(employees);
        } else {
            reject("No results returned");
        }
    });

};

module.exports.getEmployeesByStatus = (status) => {
    var statusTable = [];
    return new Promise(function (resolve, reject) {
        let t = 0;
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].status == status) {
                statusTable[t++] = employees[i];
            }
        }

        if (statusTable.length > 0) {
            resolve(statusTable);
        } else {
            reject("No results returned");
        }
    });
};

module.exports.getEmployeesByDepartment = (department) => {
    var departmentTable = [];
    return new Promise(function (resolve, reject) {
        let t = 0;
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].department == department) {
                departmentTable[t++] = employees[i];
            }
        }

        if (departmentTable.length > 0) {
            resolve(departmentTable);
        } else {
            reject("No results returned");
        }
    });
};

module.exports.getEmployeesByManager = (managerId) => {
    var managerTable = [];
    return new Promise(function (resolve, reject) {
        let t = 0;
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeManagerNum == managerId) {
                managerTable[t++] = employees[i];
            }
        }

        if (managerTable.length > 0) {
            resolve(managerTable);
        } else {
            reject("No results returned");
        }
    });
};

module.exports.getEmployeeByNum = (num) => {
    var flag = 0;
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < employees.length; i++){
            if (employees[i].employeeNum == num){
                resolve(employees[i]);
                flag = 1;
            } 
        }
        if (flag == 0){
            reject("No employee found");
        }
    });
};

module.exports.getManagers = () => {
    var managers = [];
    let t = 0;
    return new Promise(function (resolve, reject){
        for (let i = 0; i < employees.length; i++){
            if (employees[i].isManager == true){
                managers[t++] = employees[i];
            }
        }
        if (managers.length > 0){
            resolve(managers);
        } else {
            reject("No results found");
        }
    });
};

module.exports.getDepartments =  () =>{
return new Promise(function (resolve, reject) {
        if (departments.length > 0) {
            resolve(departments);
        } else {
            reject("No results returned");
        }
    });

};



