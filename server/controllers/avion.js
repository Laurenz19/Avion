/*All Functions engine to control about the Avion*/
const Avion = require('../models/avion');
const { findUserbyEmail } = require('../services/user');
const { findAllAvion, checkAvion, addAvion, findAvionbyId, deleteAvion } = require('../services/avion');
const { findAllVol, findVolbyId } = require('../services/vol');
const { createPlace, expandPlace, dropPlaces, getPlacesbyAvion, deleteAllPlace, resetPlaces } = require('../services/place');
const moment = require('moment');
const { getResbyNumAvionAndDateRes, getReservationsbyNumAvion, tabBilan, getRecette, getAllReservation } = require('../services/reservation');


/* Get the list page */
exports.getAvionList = (req, res) => {
    getPlacesbyAvion("K012CH", (places) => {
        console.log(places);
    })
    findUserbyEmail(req.session.user.email, (user) => {
        findAllAvion((avions) => {
            findAllVol((vols) => {
                res.render("avion/index.ejs", {
                    user: user,
                    title: "Visualisation des avions",
                    field: "Avion",
                    avions: avions,
                    vols: vols,
                    moment
                })
            })
        })
    })
}

/********** Add new Avion **********/
/* Get the page where we add an avion */
exports.getCreateAvion = (req, res) => {
    let errors = [];
    findUserbyEmail(req.session.user.email, (user) => {
        findAllVol((vols) => {
            res.render("avion/create.ejs", {
                user: user,
                title: "Ajout d'un Avion",
                field: "Avion",
                url: "/new_avion",
                vols: vols,
                errors
            })
        })
    })

}

/* Post new Avion in the database */
exports.postCreateAvion = (req, res) => {
    let errors = [];
    let numAvion = req.body.numAvion;
    if (numAvion.length > 10) {
        errors.push({ message: "le numéro de l'avion doit être inferieur à 10" });
    } else {
        checkAvion(req.body.numAvion, (exist) => {
            if (exist === true) {
                errors.push({ message: "Le N°Avion appartient dejà à un autre avion!" });
            } else {
                let newAvion = new Avion({
                    numAvion: req.body.numAvion,
                    design: req.body.design,
                    nbPlace: req.body.nbPlace,
                    numVol: req.body.vol,
                    dateDepart: req.body.dateDepart
                });
                console.log(newAvion);
                addAvion(newAvion, (message1) => {
                    console.log(message1);
                    createPlace(newAvion, (message2) => {
                        console.log(message2);
                        res.redirect('/avion');
                    })
                })
            }
        })
    }

    if (errors.length > 0) {
        findUserbyEmail(req.session.user.email, (user) => {
            findAllVol((vols) => {
                res.render("avion/create.ejs", {
                    user: user,
                    title: "Ajout d'un Avion",
                    field: "Avion",
                    url: "/new_avion",
                    vols: vols,
                    errors
                })
            })
        })
    }

}

/* End add_new_avion */

/********** Update an Avion **********/
/* Get the update page*/
exports.getUpdateAvion = (req, res) => {
    let errors = [];
    let oldVol = "";

    findAvionbyId(req.params.id, (avion) => {
        findUserbyEmail(req.session.user.email, (user) => {
            findAllVol((vols) => {
                if (avion.numVol == null) {
                    oldVol = null
                    res.render("avion/update.ejs", {
                        user: user,
                        title: "Modification d'un Avion",
                        field: "Avion",
                        url: "/update_avion/" + avion.id,
                        avion: avion,
                        vols: vols,
                        oldVol: oldVol,
                        errors,
                        moment
                    });
                } else {
                    findVolbyId(avion.numVol, (vol) => {
                        oldVol = vol;
                        res.render("avion/update.ejs", {
                            user: user,
                            title: "Modification d'un Avion",
                            field: "Avion",
                            url: "/update_avion/" + avion.id,
                            avion: avion,
                            vols: vols,
                            oldVol: oldVol,
                            errors,
                            moment
                        });
                    })
                }
            })
        })
    })
}

/* Save the avion updated */
exports.postUpdateAvion = (req, res) => {
    findAvionbyId(req.params.id, (avion) => {
        if (avion.nbPlace < req.body.nbPlace) {
            expandPlace(avion, req.body.nbPlace, (message) => {
                console.log(message);
            })
        }
        if (avion.nbPlace > req.body.nbPlace) {
            dropPlaces(avion, req.body.nbPlace, (message1) => {
                console.log(message1);
            })
        }
        if ((avion.dateDepart != req.body.dateDepart) || (avion.numVol != req.body.vol)) {
            getPlacesbyAvion(avion.numAvion, (places) => {
                resetPlaces(places, (message) => {
                    console.log(message);
                })
            })
        }
        avion.numAvion = req.body.numAvion
        avion.design = req.body.design;
        avion.nbPlace = req.body.nbPlace;
        avion.numVol = req.body.vol;
        avion.dateDepart = req.body.dateDepart;

        addAvion(avion, (message3) => {
            console.log(message3);
            res.redirect("/avion");
        })
    })
}

/* End update_avion */

/* Get all details about an avion */
exports.getAvionDetails = (req, res) => {
    findAvionbyId(req.params.id, (avion) => {
        findAllVol((vols) => {
            getPlacesbyAvion(avion.numAvion, (places) => {
                let nb = 0;
                let tab = [];
                places.forEach(place => {
                    if (place.occupation == false) {
                        nb++
                    }
                });
                findUserbyEmail(req.session.user.email, (user) => {
                    getAllReservation((reservations) => {
                        console.log(reservations);

                        getReservationsbyNumAvion(avion.numAvion, (Res) => {
                            if (Res.length > 0) {
                                res.render("avion/detail.ejs", {
                                    user: user,
                                    title: "Les informations sur l'avion " + avion.numAvion,
                                    field: "Avion",
                                    avion: avion,
                                    vols: vols,
                                    places: places,
                                    libre: nb,
                                    occupée: avion.nbPlace - nb,
                                    reservations: reservations,
                                    moment
                                });
                            } else {
                                res.render("avion/detail.ejs", {
                                    user: user,
                                    title: "Les informations sur l'avion " + avion.numAvion,
                                    field: "Avion",
                                    avion: avion,
                                    vols: vols,
                                    places: places,
                                    libre: nb,
                                    occupée: avion.nbPlace - nb,
                                    reservations: [],
                                    moment
                                });
                            }
                        })

                    })
                })
            })
        })
    })
}

/* Delete an Avion */
exports.getDeleteAvion = (req, res) => {
    findAvionbyId(req.params.id, (avion) => {
        console.log(avion);
        deleteAllPlace(avion.numAvion, (message1) => {
            console.log(message1);
            deleteAvion(req.params.id, (message) => {
                console.log(message);
                res.redirect("/avion");
            })
        })
    })
}

/* Get the recette max */
let getMax = (numAvion, tab2) => {
    let max = 0
    tab2.forEach(elem => {
        if ((elem.avion == numAvion)) {
            if (max <= elem.total) {
                max = elem.total;
            }
        }
    });
    return max;
}

exports.getRecette = (req, res) => {

    let currentDate = new Date()
    let year = currentDate.getFullYear();
    findUserbyEmail(req.session.user.email, (user) => {
        findAllAvion((avions) => {
            getAllReservation((reservations) => {
                findAllVol((vols) => {

                    let tab = [];
                    avions.forEach(avion => {
                        let total = 0;
                        reservations.forEach(reservation => {
                            let dateY = new Date(reservation.dateRes);
                            vols.forEach(vol => {
                                if ((reservation.numAvion == avion.numAvion) && (dateY.getFullYear() == year)) {
                                    if (vol.id == reservation.numVol) {
                                        total = total + vol.frais;
                                        tab.push({
                                            avion: avion.numAvion,
                                            vol: vol.villeDepart + "-" + vol.villeArrivee,
                                            total: total
                                        })
                                    }
                                }
                            });
                        });

                    });
                    //console.log(tab);
                    let tab1 = [];
                    avions.forEach(avion => {
                        tab1.push({
                            num: avion.numAvion,
                            design: avion.design,
                            nbPlace: avion.nbPlace,
                            total: getMax(avion.numAvion, tab)
                        })
                    });
                    console.log(tab1);
                    res.render("app/recette.ejs", {
                        user: user,
                        title: "Recette des avions cette année",
                        field: "Avion",
                        bilan: tab1,

                    });
                })
            })
        })

    })
}
