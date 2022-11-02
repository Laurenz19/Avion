/* All Queries about vol*/
const Vol = require('../models/vol');

/* Add Vol into Database */
exports.addVol = async(vol, next) => {
    await vol.save()
        .then(() => {
            return next("vol added");

        })
        .catch(err => { return next(err) })
}

/* Check if a Vol is already exist */
exports.checkItineraire = async(villedep, villeArr, next) => {
    await Vol.findOne({ villeDepart: villedep, villeArrivee: villeArr })
        .then((result) => {
            if (result === null) return next(false);
            else return next(true);
        })
        .catch(err => console.log(err));
}

/* Find Vol by Id */
exports.findVolbyId = async(id, next) => {
    await Vol.findById(id)
        .then((result) => {
            return next(result);
        })
        .catch(err => console.log(err));
}

/* Find All Vol */
exports.findAllVol = async(next) => {
    await Vol.find()
        .then((results) => {
            return next(results);
        })
        .catch(err => console.log(err));
}

/* delete a vol */
exports.deleteVol = async(id, next) => {
    await Vol.findByIdAndRemove(id)
        .then(() => {
            return next("Vol deleted");
        })
        .catch(err => {
            return next(err);
        })
}