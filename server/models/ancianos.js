const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const dateFormat = require('dateformat');

let Schema = mongoose.Schema;

let generoValido = {
    values: ['Masculino', 'Femenino'],
    message: '{VALUE} no es una especialidad válida.'
}

let ancianosSchema = new Schema({
    nombres: {
        type: String,
        required: [true, 'El nombre del adulto mayor de salud es obligatorio.']
    },
    apellidos: {
        type: String,
        required: [true, 'El apellido del adulto mayor es obligatorio.']
    },
    tipoID: {
        type: String,
        required: [true, 'El documento de identidad del adulto mayor es obligatorio.']
    },
    numeroID: {
        type: String,
        //unique: true,
        required: [true, 'El documento de identidad del adulto mayor es obligatorio.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo electrónico del adulto mayor es obligatorio.']
    },
    celular: {
        type: String,
        //unique: true,
        required: [true, 'El número de contacto del adulto mayor es obligatorio.']
    },
    nombresReferencia: {
        type: String,
        required: [true, 'El nombre de la referencia del adulto mayor es obligatorio.']
    },
    telefonoReferencia: {
        type: String,
        required: [true, 'El teléfono de la referencia del adulto mayor es obligatorio.']
    },
    direccion: {
        type: String,
        required: [true, 'La dirección del domicilio del adulto mayor es obligatorio.']
    },
    ocupacion: {
        type: String,
        required: [true, 'La ocupación del domicilio del adulto mayor es obligatorio.']
    },
    genero: {
        type: String,
        enum: generoValido,
        required: [true, 'El género del adulto mayor es obligatorio.']
    },
    edad: {
        type: String,
        required: [true, 'La edad del adulto mayor es obligatorio.']
    },
    ingreso: {
        type: String,
        default: dateFormat(new Date(), "dd-mm-yyyy").toString(),
    },
    img: {
        type: String,
        required: false
    },
    estado: {
        type: Boolean,
        default: true,
    }
});

ancianosSchema.plugin(uniqueValidator, {message: '{Es obligatorio que el valor de {PATH} sea único.'});

module.exports = mongoose.model('Ancianos', ancianosSchema);