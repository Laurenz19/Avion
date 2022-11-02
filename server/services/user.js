const User = require('../models/user');
const bcrypt = require('bcrypt');

/* Find User by Email */
exports.findUserbyEmail = async(email, next) => {
    await User.findOne({ email: email })
        .then((result) => {
            return next(result);
        })
        .catch(err => console.log(err))
}

/* Find User by id */
exports.findUserbyId = async(id, next) => {
    await User.findById(id)
        .then((result) => {
            return next(result);
        })
        .catch(err => console.log(err));
}

exports.getAllUser = async(next) => {
    await User.find()
        .then((results) => {
            return next(results);
        })
        .catch(err => console.log(err));
}

/*Compare 2 Passwords Crypted*/
exports.isValidPassword = async(Pwd1, Pwd2, next) => {
    await bcrypt.compare(Pwd1, Pwd2, (err, correct) => {
        if (err) {
            console.log("isValidPasswordError " + err);
        }
        if (correct) {
            return next(true);
        } else {
            return next(false);
        }
    })
}