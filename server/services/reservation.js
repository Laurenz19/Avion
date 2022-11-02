/* All Queries about reservation */
const Reservation = require('../models/reservation');
const Vol = require('../models/vol');
const { findVolbyId } = require('../services/vol');


/* Add reservation */
exports.addReservation = async(reservation, next) => {
    await reservation.save()
        .then(() => {
            return next("Reservation added or updated");
        })
        .catch(err => console.log(err));
}

/* find Reservation by id */
exports.findReservationbyid = async(id, next) => {
    await Reservation.findById(id)
        .then((result) => {
            return next(result);
        })
        .catch(err => console.log(err));
}

/* find Reservation by N° Reservation */
exports.findReservationbyNum = async(numRes, next) => {
    await Reservation.findOne({ numReservation: numRes })
        .then((result) => {
            return next(result);
        })
        .catch(err => console.log(err));
}

/* Get All reservations */
exports.getAllReservation = async(next) => {
    await Reservation.find()
        .then((results) => {
            return next(results);
        })
        .catch(err => console.log(err));
}

/* Get Reservation by N°Avion */
exports.getReservationsbyNumAvion = async(numAvion, next) => {
    await Reservation.find({ numAvion: numAvion })
        .then((results) => {
            return next(results);
        })
        .catch(err => console.log(err));
}

/* Get Reservation by N°Avion and date de Reservation */
exports.getResbyNumAvionAndDateRes = async(numAvion, dateRes, next) => {
    await Reservation.find({ numAvion: numAvion, dateRes: dateRes })
        .then((results) => {
            return next(results);
        })
        .catch(err => console.log(err));
}

/* Get Reservation by Date */
exports.getReservationsByDate = async(dateRes, next) => {
    await Reservation.find({ dateRes: dateRes })
        .then((results) => {
            return next(results);
        })
        .catch(err => console.log(err));
}

/* Delete Reservation by id */
exports.deleteReservationbyId = async(id, next) => {
    await Reservation.findByIdAndRemove(id)
        .then(() => {
            return next("Reservation deleted");
        })
        .catch(err => console.log(err));
}

/* Delete All reservation */
exports.deleteAllRes = async(numAvion, next) => {
    await Reservation.deleteMany({ numAvion: numAvion })
        .then(() => {
            return next("Reservation deleted");
        })
        .catch(err => console.log(err));
}

/* Check if num Reservation exist */
exports.checkNumRes = async(numRes, next) => {
    await Reservation.findOne({ numReservation: numRes })
        .then((reservation) => {
            if (reservation === null) return next(false);
            else return next(true);
        })
        .catch(err => console.log(err));
}

/* Generate NumRes */
exports.generateNumres = async(next) => {
    let numRes = "Res_" + (Math.floor(Math.random() * 10000) + 1);
    return next(numRes);
}

/* Convert String to Date */
exports.stringToDate = async(date, next) => {
    let tab = date.split("/");
    let newDate = new Date(tab[2].trim() + "-" + tab[1].trim() + "-" + tab[0].trim());
    return next(newDate);
}

/* Calcul recette par mois */
exports.bilanbyMonth = async(recette, mounth, next) => {
    let total = 0;
    recette.forEach(elem => {
        if (elem.mounth == mounth) {
            total = total + elem.frais;
        }
    });
    next(total);
}

/* bilan */
exports.tabBilan = async(reservation, next) => {
    let tabRecette = [];
    reservation.forEach(elem => {
        let d = new Date(elem.dateRes);
        // console.log(elem);
        Vol.findById(elem.numVol)
            .then((vol) => {
                tabRecette.push({
                    numAvion: elem.numAvion,
                    mounth: d.getMonth(),
                    year: d.getFullYear(),
                    client: elem.voyageur,
                    frais: vol.frais
                })
                next(tabRecette);
            })
            .catch(err => console.log(err));

    });

}

/* bilan */
exports.getRecette = async(tab, next) => {
    let mounth = [];
    for (let m = 0; m < 12; m++) {
        this.bilanbyMonth(tab, m, (total) => {
            mounth.push({
                mois: m,
                total: total
            })
        })
    }
    next(mounth);
}