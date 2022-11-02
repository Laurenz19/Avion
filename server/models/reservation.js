/*Reservation Model*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    numReservation: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10
    },
    numAvion: {
        type: String,
        maxlength: 10,
        required: true
    },
    numPlace: {
        type: Number,
        required: true
    },
    numVol: {
        type: String,
        required: true
    },
    dateRes: {
        type: Date,
        required: true
    },
    voyageur: {
        type: String,
        required: true,
        maxlength: 250,
        minlength: 3
    }

}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);