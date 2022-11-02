const bcrypt = require('bcrypt');
const User = require('../models/user');
const moment = require('moment');

//import all services
const { findUserbyEmail, isValidPassword, getAllUser } = require('../services/user');
const { findAllAvion } = require('../services/avion');
const { getAllReservation } = require('../services/reservation');
const { findAllVol } = require('../services/vol');

//Register
/*Get Register Page*/
exports.getRegister = (req, res) => {
    res.render('Auth/signup', {
        path: '/register'
    })
}

exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;


    console.log(name + ' ' + email + ' ' + password);

    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Veuillez remplir tout les formulaires" });
    }

    if (password !== password2) {
        errors.push({ message: "Veuillez verifier votre mot de passe" });
    }

    if (password.length < 5) {
        errors.push({ message: "le mot de passe devrait avoir au moins 6 caractères" });
    }
    if (name.length < 4) {
        errors.push({ message: "le nom devrait avoir au moins 5 caractères" });
    }

    if (errors.length > 0) {
        res.render('Auth/signup', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    const newUser = new User({
                        username: name,
                        email: email,
                        password: password
                    });
                    //hashed password
                    bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(newUser.password, salt, (error, hash) => {

                            //Set password to hash
                            newUser.password = hash;
                            console.log(hash);
                            console.log(error);

                            let registeredUser = {
                                email: newUser.email,
                                password: newUser.password
                            }
                            req.session.user = registeredUser;
                            console.log(req.session.user);

                            //save user
                            newUser.save()
                                .then(user => {
                                    console.log(user);
                                    next();
                                    res.redirect('/login');
                                })
                                .catch(error => console.log(error));

                        });
                        console.error(error);
                    });

                } else {
                    errors.push({ message: "email identique à un autre compte" });
                    res.render('Auth/signup', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
            })
            .catch(error => console.log(error));

    }

};

//SignIn
/*Get Login Page*/
exports.getlogin = (req, res) => {
    console.log(req.session.user)
    let user = req.session.user;
    res.render('Auth/signin', {
        path: '/login',
        user: user
    })
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let errors = [];
    let userLoged = {};

    if (!email || !password) {
        errors.push({ message: "Veuillez remplir correctement le formulaire" });
    }

    if (errors.length > 0) {
        res.render('Auth/signin', {
            errors
        })
    } else {
        findUserbyEmail(email, (user) => {
            if (!user) {
                console.log('Aucun utilisateur est associé à cet email');
                res.redirect('/login');
            } else {
                isValidPassword(password, user.password, (valid) => {
                    if (valid == false) {
                        console.log("Mot de passe incorrect");
                        res.redirect('/login');
                    } else {
                        userLoged = {
                            name: user.name,
                            email: user.email,
                            password: user.password
                        }
                        req.session.user = userLoged;
                        res.redirect('/home');
                    }
                })

            }

        })
    }

}

/*Secure the Page*/
exports.secureLog = (req, res, next) => {
    if (req.session.user) next();
    else {
        res.redirect('/login');
    }
}

/*LogOut function*/
exports.logout = (req, res) => {
    req.session.destroy(() => console.log("User logged out"));
    res.redirect('/login')
}

/*Un test pour le login*/
exports.test = (req, res) => {
    let email = req.session.user.email;
    console.log(email);


    findUserbyEmail(email, (user) => {
        getAllUser((users) => {
            findAllAvion((avions) => {
                getAllReservation((reservations) => {
                    findAllVol((vols) => {
                        console.log(user);
                        res.render("index.ejs", {
                            user: user,
                            field: "Acceuil",
                            users: users,
                            avions,
                            reservations,
                            vols,
                            moment
                        });
                    })
                })
            })

        })
    })

}