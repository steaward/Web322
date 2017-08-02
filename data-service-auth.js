const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var userSchema = new Schema({
    "user": { type: String, unique: true },
    "password": String,
    "password2": String
});

let User;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb://sward15:L3r9k120hp@ds129043.mlab.com:29043/ass7");
        db.on('error', (err) => {
            reject(err)
        });
        db.once('open', () => {
            console.log("NO ERRORS");
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userData) {

    return new Promise(function (resolve, reject) {
        if (userData.password != userData.password2) {
            reject("Passwords do not match");
        }
        
        else {
            var newUser = new User(userData);

            newUser.save((err) => {
                if (err) {
                    //this isn't working for me
                    if (err.code === 11000) {
                        reject("Username already taken");
                    }
                    else {

                        reject("Error creating user: " + err);
                    }
                }
                else {
                    resolve();
                }
            });
        }
        // process.exit();
    });
};

module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {
        User.find({ user: userData.user })
            .exec()
            .then((users) => {
                if (users.length < 0) {
                    reject("Unable to find user:" + userData.user);
                }
                else if (users[0].password != userData.password) {
                    reject("Incorrect password for user: " + userData.user);
                }
                else {
                    resolve();
                }
            }).catch((err) => {
                reject("Unable to find user: " + userData.user);
            });
    });
};