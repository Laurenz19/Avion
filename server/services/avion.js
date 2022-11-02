/*All Queries about Avion*/
const Avion = require('../models/avion');

/* Add Avion into Database */
exports.addAvion = async(avion, next) => {
    await avion.save()
        .then(() => {
            return next("Avion added or updated");
        })
        .catch(err => { return next(err) })
}

/* Find Avion by id */
exports.findAvionbyId = async(id, next) => {
    await Avion.findById(id)
        .then((result) => {
            return next(result);
        })
        .catch(err => console.log(err));
}

/* Find Avion by num */
exports.findAvionbyNum = async(numAvion, next) => {
    await Avion.findOne({ numAvion: numAvion })
        .then((result) => {
            return next(result);
        })
        .catch(err => console.log(err));
}

/* Find All Avion */
exports.findAllAvion = async(next) => {
    await Avion.find()
        .then((results) => {
            return next(results);
        })
        .catch(err => console.log(err));
}

/* Find Avion by vol */
exports.findAvionsbyNumVol = async(numVol, next) => {
    await Avion.find({ numVol: numVol })
        .then((results) => {
            return next(results)
        })
        .catch(err => console.log(err));
}

/* Find Avion by dateDepart */
exports.findAvionsbyDateDepart = async(date, next) => {
    await Avion.find({ dateDepart: date })
        .then((results) => {
            return next(results);
        })
        .catch(err => console.log(err));
}

/* delete a plane (avion) */
exports.deleteAvion = async(id, next) => {
    await Avion.findByIdAndRemove(id)
        .then(() => {
            return next("Avion deleted");
        })
        .catch(err => {
            return next(err);
        });
}

/* check if avion exists already */
exports.checkAvion = async(numAvion, next) => {
    await Avion.findOne({ numAvion: numAvion })
        .then((avion) => {
            if (avion === null) return next(false);
            else return next(true);
        })
        .catch(err => console.log(err));
}

/* check if avion exists already */
exports.checkAvionbyId = async(id, next) => {
    await Avion.findOne({ id: id })
        .then((avion) => {
            if (avion === null) return next(false, null);
            else return next(true, avion);
        })
        .catch(err => console.log(err));
}