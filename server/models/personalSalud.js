const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let especialidadesValidas = {
    values: ['Medicina', 'Enfermería', 'Odontología', 'Psicología', 'Gerontología'],
    message: '{VALUE} no es una especialidad válida.'
}

let personalSaludSchema = new Schema({
    nombres: {
        type: String,
        required: [true, 'El nombre del personal de salud es obligatorio.']
    },
    apellidos: {
        type: String,
        required: [true, 'El apellido del personal de salud es obligatorio.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo electrónico del personal de salud es obligatorio.']
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
    estudios: {
        type: String,
        default: 'Información no disponible',
        required: false
    },
    especialidad: {
        type: String,
        enum: especialidadesValidas,
        required: [true, 'La especialidad del personal de salud es obligatorio.']
    },
    senescyt: {
        type: String,
        required: false,
        //unique: true,
        default: 'Información no disponible',
    },
    celular: {
        type: String,
        //unique: true,
        required: [true, 'El número de contacto del personal de salud es obligatorio.']
    },
    consultorio: {
        type: String,
        required: [true, 'La dirección del consultorio del personal de salud es obligatorio.']
    },
    img: {
        type: String,
        required: false,
        default: 'image-acpam'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    }
});

personalSaludSchema.plugin(uniqueValidator, {message: '{Es obligatorio que el valor de {PATH} sea único.'});

module.exports = mongoose.model('PersonalSalud', personalSaludSchema);
