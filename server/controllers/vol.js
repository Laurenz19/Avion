/*All Functions engine to control about the Vol*/
const Vol = require('../models/vol');
const { findUserbyEmail } = require('../services/user');
const {
    findAllVol,
    findVolbyId,
    deleteVol,
    addVol,
    checkItineraire
} = require('../services/vol');


/* Get the list of Vol saved */
exports.getListvol = (req, res) => {
    findAllVol((vols) => {
        //console.log(vols);
        findUserbyEmail(req.session.user.email, (user) => {
            res.render("vol/index.ejs", {
                user: user,
                title: "Visualisation des Vols",
                field: "Vol",
                vols: vols
            })
        })
    })
}

/********** Add new Vol *********/
/* Get the Page where we add a new Vol */
exports.getCreateVol = (req, res) => {
    let errors = [];
    findUserbyEmail(req.session.user.email, (user) => {
        res.render("vol/create.ejs", {
            user: user,
            title: "Ajout d'un Vol",
            field: "Vol",
            url: "/new_vol",
            errors
        })
    })

}

/* Post new Vol in Database */
exports.postCreateVol = (req, res) => {
    let errors = [];

    checkItineraire(req.body.villeDepart, req.body.villeArrivee, (exist) => {
        if (exist === true) {
            console.log("le vol: " + req.body.villeDepart + "-" + req.body.villeArrivee + " existe dejà");
            errors.push({ message: "le vol: " + req.body.villeDepart + "-" + req.body.villeArrivee + " existe dejà!" })
            if (errors.length > 0) {
                findUserbyEmail(req.session.user.email, (user) => {
                    res.render("vol/create.ejs", {
                        user: user,
                        title: "Ajout d'un Vol",
                        field: "Vol",
                        url: "/new_vol",
                        errors
                    })
                })
            }
        } else {
            let newVol = new Vol({
                villeDepart: req.body.villeDepart,
                villeArrivee: req.body.villeArrivee,
                frais: req.body.frais
            });
            console.log(newVol);
            addVol(newVol, (message) => {
                console.log(newVol);
                res.redirect('/vol');
                console.log(message);
            })
        }
    })
}

/* End add_new_vol */


/********** Update a vol *********/
/* Get the page where we can update a vol*/
exports.getUpdateVol = (req, res) => {
    let errors = [];
    findVolbyId(req.params.id, (vol) => {
        findUserbyEmail(req.session.user.email, (user) => {
            res.render("vol/update.ejs", {
                user: user,
                vol: vol,
                title: "Modification du vol: " + vol.villeDepart + " - " + vol.villeArrivee,
                field: "Vol",
                url: "/update_vol/" + vol.id,
                errors
            });
        })
    })
}

/* Post the vol updated in the database */
exports.postUpdatevol = (req, res) => {
    findVolbyId(req.params.id, (vol) => {
        vol.villeDepart = req.body.villeDepart;
        vol.villeArrivee = req.body.villeArrivee;
        vol.frais = req.body.frais;

        console.log(vol);
        addVol(vol, (message) => {
            console.log(vol);
            res.redirect('/vol');
            console.log(message);
        })
    })
}

/* End update_new_vol */

/* Delete a vol */
exports.getdeleteVol = (req, res) => {
    deleteVol(req.params.id, (message) => {
        console.log(message);
        res.redirect('/vol');
    })

}