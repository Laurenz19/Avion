/*Avion Model*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avionSchema = new Schema({
    numAvion: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10
    },
    design: {
        type: String,
        required: true,
        minlength: 3
    },
    nbPlace: {
        type: Number,
        required: true
    },
    numVol: {
        type: Schema.Types.ObjectId,
        ref: 'Vol',
        required: false
    },
    dateDepart: {
        type: Date,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Avion', avionSchema);