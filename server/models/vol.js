/*Vol Model*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const volSchema = new Schema({
    villeDepart: {
        type: String,
        required: true,
        maxlength: 15,
        minlength: 2
    },
    villeArrivee: {
        type: String,
        required: true,
        maxlength: 15,
        minlength: 2
    },
    frais: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Vol', volSchema);