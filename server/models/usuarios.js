const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuariosSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo electrónico del personal de salud es obligatorio.']
    },
    password: {
        type: String,
        required: [true, 'La contraseña para la cuenta del personal de salud es obligatorio.']
    },
    rol: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true,
    }
});

usuariosSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;
    delete userObject.email;

    return userObject;
}

usuariosSchema.plugin(uniqueValidator, {message: '{Es obligatorio que el valor de {PATH} sea único.'});

module.exports = mongoose.model('Usuarios', usuariosSchema);
