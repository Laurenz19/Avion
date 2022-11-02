/*Place model*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({
    numAvion: {
        type: String,
        unique: false,
        maxlength: 10
    },
    numPlace: {
        type: Number,
        unique: false,
        required: true
    },
    occupation: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Place", placeSchema);