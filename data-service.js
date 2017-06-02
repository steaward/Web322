
const fs = require('fs');

var employees = [];
var departments = [];

module.exports.initialize = function(){
    var i = 0;
    var fail = false;
    return new Promise(function(resolve, reject){
        fs.readFile('./data/employees.json',(err, data) => {
            if(err){
                console.log("File could not be opened...");
                fail = true;
                
            } else {  
             employees = JSON.parse(data); 
            }  
        });

        fs.readFile('./data/employees.json',(err, data) => {
             if(err){
                console.log("File could not be opened...");
                fail = true;
                
            } else {  
             departments = JSON.parse(data); 
            }  
        });

        if(fail){
            reject("File could not be opened");
        } else {
            resolve();
        }
    });
};

module.exports.getAllEmployees = function() {
    return new Promise(function (resolve, reject){
        if (employees.length > 0){
            resolve(employees);
        } else{
            reject("No results returned");
        }    
    });

};

module.exports.getEmployeesByStatus = function(status) {

}


