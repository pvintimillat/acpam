const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let adminGADSchema = new Schema({
    nombres: {
        type: String,
        required: [true, 'El nombre del personal de salud es obligatorio.']
    },
    apellidos: {
        type: String,
        required: [true, 'El apellido del personal de salud es obligatorio.']
    },
    tipoID: {
        type: String,
        required: [true, 'El documento de identidad del personal de salud es obligatorio.']
    },
    numeroID: {
        type: String,
        //unique: true,
        required: [true, 'El documento de identidad del personal de salud es obligatorio.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo electrónico del personal de salud es obligatorio.']
    },
    celular: {
        type: String,
        //unique: true,
        required: [true, 'El número de contacto del personal de salud es obligatorio.']
    },
    img: {
        type: String,
        required: false
    },
    rol: {
        type: String,
        required: true,
    },
    estado: {
        type: Boolean,
        default: true,
    }
});

adminGADSchema.plugin(uniqueValidator, {message: '{Es obligatorio que el valor de {PATH} sea único.'});

module.exports = mongoose.model('AdminGAD', adminGADSchema);