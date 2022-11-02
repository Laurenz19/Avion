/* All Queries about Place */
const Place = require("../models/place");

/* Create Place */
exports.createPlace = async(avion, next) => {
    let places = [];
    for (let i = 1; i <= avion.nbPlace; i++) {
        places.push({
            numAvion: avion.numAvion,
            numPlace: i,
            occupation: false
        });
    }

    await Place.insertMany(places)
        .then(() => {
            return next("Places created!")
        })
        .catch(err => console.log(err));
}

/* To expand the place */
exports.expandPlace = async(avion, nbPlace, next) => {
    let places = [];
    for (let i = avion.nbPlace; i < nbPlace; i++) {
        places.push({
            numAvion: avion.numAvion,
            numPlace: i + 1,
            occupation: false
        });
        console.log(i);
    }
    console.log(places);

    await Place.insertMany(places)
        .then(() => {
            return next("Places created!")
        })
        .catch(err => console.log(err));
}

/* To drop some place */
exports.dropPlaces = async(avion, nbPlace, next) => {
    for (let i = avion.nbPlace; i > nbPlace; i--) {
        this.deletePlace(avion.numAvion, i, (message) => {
            console.log(message);
        })
    }
    return next("Places droped");
}

/* Save Place in the database */
exports.savePlace = async(place, next) => {
    await place.save()
        .then(() => {
            return next("Place saved")
        })
        .catch(err => console.log(err));
}

/* Update place */
exports.updatePlace = async(numAvion, numPlace, occupation, next) => {
    await Place.findOne({ numAvion: numAvion, numPlace: numPlace })
        .then((place) => {
            place.occupation = occupation
            this.savePlace(place, (message) => {
                console.log(message);
                return next(place);
            })
        })
        .catch(err => console.log(err));
}

/* get all place by Avion */
exports.getPlacesbyAvion = async(numAvion, next) => {
    await Place.find({ numAvion: numAvion })
        .then((results) => {
            return next(results)
        })
        .catch(err => console.log(err));
}

/* Get all places */
exports.getAllPlaces = async(next) => {
    await Place.find()
        .then((places) => {
            return next(places);
        })
        .catch(err => console.log(err));
}

/* Check the place status */
exports.checkThePlaceStatus = async(numAvion, numPlace, next) => {
    await Place.findOne({ numAvion: numAvion, numPlace: numPlace })
        .then((place) => {
            return next(place.occupation);
        })
        .catch(err => console.log(err));
}

/* Delete Place by numAvion and numPlace */
exports.deletePlace = async(numAvion, numPlace, next) => {
    await Place.deleteOne({ numAvion: numAvion, numPlace: numPlace })
        .then(() => {
            return next("Place deleted");
        })
        .catch(err => console.log(err));
}

/* Delete All Place by numAvion*/
exports.deleteAllPlace = async(numAvion, next) => {
    await Place.deleteMany({ numAvion: numAvion })
        .then(() => {
            return next("Place Deleted")
        })
        .catch(err => console.log(err));
}

/* Reset all Places */
exports.resetPlaces = async(places, next) => {
    places.forEach(place => {
        place.occupation = false;
        this.savePlace(place, (message) => {
            console.log(message);
            return next(place);
        })
    });
}