/* All fonctions engine to control the order field */
const Reservation = require('../models/reservation');
const { findAllAvion, findAvionsbyNumVol, findAvionbyNum } = require('../services/avion');
const { getPlacesbyAvion, updatePlace, checkThePlaceStatus } = require('../services/place');
const { getAllReservation, checkNumRes, generateNumres, addReservation, stringToDate, findReservationbyid, deleteReservationbyId, findReservationbyNum } = require('../services/reservation');
const { findUserbyEmail } = require('../services/user');
const { findAllVol, findVolbyId } = require('../services/vol');
const moment = require('moment');
const avion = require('../models/avion');
const place = require('../models/place');


/* Get the Page List*/
exports.getReservations = (req, res) => {
    findUserbyEmail(req.session.user.email, (user) => {
        getAllReservation((reservations) => {
            findAllAvion((avions) => {
                findAllVol((vols) => {
                    res.render("reservation/index.ejs", {
                        user: user,
                        title: "Visualisation des réservation",
                        field: "Réservation",
                        reservations: reservations,
                        avions: avions,
                        vols: vols,
                        moment
                    })
                })
            })
        })
    })
}

/********* Add new Reservation  *******/
/* Get the page where we add a reservation */
exports.getCreateRes1of3 = (req, res) => {
    let errors = [];
    findUserbyEmail(req.session.user.email, (user) => {
        findAllVol((vols) => {
            res.render("reservation/create1of3.ejs", {
                user: user,
                title: "Ajout d'une réservation Partie 1",
                field: "réservation",
                url: "/new_res_1of3",
                vols: vols,
                errors
            })
        })
    })
}
exports.postCreateRes1of3 = (req, res) => {
    let errors = [];
    console.log(req.body.nom + " " + req.body.prenoms + " " + req.body.vol);
    findUserbyEmail(req.session.user.email, (user) => {
        findAvionsbyNumVol(req.body.vol, (avions) => {
            res.render("reservation/create2of3.ejs", {
                user: user,
                title: "Ajout d'une réservation Partie 2",
                field: "réservation",
                url: "/new_res_2of3",
                nom: req.body.nom + " " + req.body.prenoms,
                avions: avions,
                errors,
                moment
            })
        })
    })
}

exports.postCreateRes2of3 = (req, res) => {
    let errors = [];
    console.log(req.body.nom + " " + req.body.numAvion + " " + req.body.dateRes);
    findUserbyEmail(req.session.user.email, (user) => {
        getPlacesbyAvion(req.body.numAvion, (places) => {
            let nb = 0;
            places.forEach(place => {
                if (place.occupation === false) nb++;
            });

            findAvionbyNum(req.body.numAvion, (avion) => {
                findVolbyId(avion.numVol, (vol) => {
                    res.render("reservation/create3of3.ejs", {
                        user: user,
                        title: "Ajout d'une réservation Partie 3",
                        field: "réservation",
                        url: "/new_res_3of3",
                        nom: req.body.nom,
                        avion: avion,
                        places: places,
                        vol: vol,
                        nb,
                        errors,
                        moment
                    })
                })
            })
        })
    })
}

exports.postCreateRes3of3 = (req, res) => {
    let errors = [];
    generateNumres((numRes) => {
        stringToDate(req.body.dateRes, (dateRes) => {
            let numAvion = req.body.numAvion;
            let voyageur = req.body.nom;
            let numPlace = req.body.numPlace;

            checkNumRes(numRes, (exist) => {
                if (exist == false) {
                    numRes = numRes;
                } else {
                    numRes = "2" + numRes;
                }
                findAvionbyNum(numAvion, (avion) => {
                    checkThePlaceStatus(numAvion, numPlace, (occupation) => {

                        if (occupation == false) {
                            console.log(occupation);
                            let newRes = new Reservation({
                                numReservation: numRes,
                                numAvion: numAvion,
                                numPlace: numPlace,
                                numVol: avion.numVol,
                                dateRes: dateRes,
                                voyageur: voyageur
                            });
                            console.log(newRes);
                            addReservation(newRes, (message1) => {
                                console.log(message1);
                                updatePlace(numAvion, numPlace, true, (place) => {
                                    console.log(place);
                                    res.redirect("/reservation");
                                })
                            })
                        } else {
                            errors.push({ message: "Cette place est dejà prise!" });
                            if (errors.length > 0) {
                                findUserbyEmail(req.session.user.email, (user) => {
                                    getPlacesbyAvion(avion.numAvion, (places) => {
                                        let nb = 0;
                                        places.forEach(place => {
                                            if (place.occupation === false) nb++;
                                        });

                                        findVolbyId(avion.numVol, (vol) => {
                                            res.render("reservation/create3of3.ejs", {
                                                user: user,
                                                title: "Ajout d'une réservation Partie 3",
                                                field: "réservation",
                                                url: "/new_res_3of3",
                                                nom: req.body.nom,
                                                avion: avion,
                                                places: places,
                                                vol: vol,
                                                nb,
                                                errors,
                                                moment
                                            })
                                        })
                                    })

                                })
                            }
                        }

                    })
                })

            })
        })
    })
}

/* End add_new_reservation */

/********* Update a Reservation  *******/
/* Get the Update Page */
exports.getUpdateRes1of2 = (req, res) => {
    let errors = [];
    findUserbyEmail(req.session.user.email, (user) => {
        findReservationbyid(req.params.id, (reservation) => {
            console.log(reservation);
            findAvionbyNum(reservation.numAvion, (avion) => {
                findVolbyId(avion.numVol, (vol) => {
                    findAllAvion((avions) => {
                        findAllVol((vols) => {
                            res.render("reservation/update1of2.ejs", {
                                user: user,
                                title: "Modification d'une réservation Partie 1",
                                field: "réservation",
                                url: "/update_res_1of2/" + reservation.id,
                                reservation: reservation,
                                avions: avions,
                                vol: vol,
                                vols: vols,
                                errors,
                                moment
                            })
                        })
                    })
                })
            })
        })
    })
}

/* Save the reservation Updated */
exports.postUpdateRes1of2 = (req, res) => {
    let errors = [];
    findUserbyEmail(req.session.user.email, (user) => {
        getPlacesbyAvion(req.body.numAvion, (places) => {
            let nb = 0;
            places.forEach(place => {
                if (place.occupation === false) nb++;
            });

            findAvionbyNum(req.body.numAvion, (avion) => {
                res.render("reservation/update2of2.ejs", {
                    user: user,
                    title: "Modification d'une réservation Partie 2",
                    field: "réservation",
                    url: "/update_res_2of2/" + req.params.id,
                    voyageur: req.body.nom,
                    places: places,
                    vol: req.body.vol,
                    numPlace: req.body.numPlace,
                    avion: avion,
                    nb,
                    errors,
                    moment
                })
            })
        })
    })
}

exports.postUpdateRes2of2 = (req, res) => {
    let errors = [];
    stringToDate(req.body.dateRes, (dateRes) => {
        let numAvion = req.body.numAvion;
        let voyageur = req.body.nom;
        let numPlace = req.body.numPlace;

        findReservationbyid(req.params.id, (reservation) => {
            if (reservation.numAvion != numAvion) {
                updatePlace(reservation.numAvion, reservation.numPlace, false, (place) => {
                    console.log(place);
                })
            } else {
                if (reservation.numPlace != numPlace) {
                    updatePlace(reservation.numAvion, reservation.numPlace, false, (place) => {
                        console.log(place);
                    })
                }
            }
            findAvionbyNum(numAvion, (avion) => {
                checkThePlaceStatus(numAvion, numPlace, (occupation) => {
                    if (occupation == false) {
                        reservation.numAvion = numAvion;
                        reservation.voyageur = voyageur;
                        reservation.numPlace = numPlace;
                        reservation.dateRes = dateRes;
                        reservation.numVol = avion.numVol;

                        addReservation(reservation, (message) => {
                            console.log(message);
                            updatePlace(numAvion, numPlace, true, (place) => {
                                console.log(place);
                                res.redirect("/reservation");
                            })
                        })
                    } else {
                        errors.push({ message: "Cette place est dejà prise" });
                        if (errors.length > 0) {
                            findUserbyEmail(req.session.user.email, (user) => {
                                getPlacesbyAvion(req.body.numAvion, (places) => {
                                    let nb = 0;
                                    places.forEach(place => {
                                        if (place.occupation === false) nb++;
                                    });

                                    res.render("reservation/update2of2.ejs", {
                                        user: user,
                                        title: "Modification d'une réservation Partie 2",
                                        field: "réservation",
                                        url: "/update_res_2of2/" + req.params.id,
                                        voyageur: req.body.nom,
                                        places: places,
                                        vol: req.body.vol,
                                        numPlace: req.body.numPlace,
                                        avion: avion,
                                        nb,
                                        errors,
                                        moment
                                    })
                                })
                            })
                        }
                    }
                })
            })
        })
    })
}

/* End update_reservation */

/* Get all details about a reservation */
exports.getResDetails = (req, res) => {
    findUserbyEmail(req.session.user.email, (user) => {
        findReservationbyid(req.params.id, (reservation) => {
            findAvionbyNum(reservation.numAvion, (avion) => {
                findVolbyId(reservation.numVol, (vol) => {
                    res.render("reservation/detail.ejs", {
                        user: user,
                        title: "Informations sur la reservation " + reservation.numReservation,
                        field: "réservation",
                        vol: vol,
                        reservation: reservation,
                        avion: avion,
                        moment
                    })
                })
            })
        })
    })
}

/* Delete a reservation */
exports.getDeleteRes = (req, res) => {
    findReservationbyid(req.params.id, (reservation) => {
        updatePlace(reservation.numAvion, reservation.numPlace, false, (place) => {
            console.log(place);
            deleteReservationbyId(req.params.id, (message) => {
                console.log(message);
                res.redirect("/reservation");
            })
        })
    })
}

/* Recette */
exports.getBilan = (req, res) => {
    let tab = [];
    findUserbyEmail(req.session.user.email, (user) => {
        getAllReservation((reservations) => {

            reservations.forEach(reservation => {
                findVolbyId(reservation.numVol, (vol) => {
                    tab.push({
                        numAvion: reservation.numAvion,
                        date: reservation.dateRes,
                        client: reservation.voyageur,
                        frais: vol.frais
                    })
                    res.render("avion/bilan.ejs");
                })
            });
        })
    })
}