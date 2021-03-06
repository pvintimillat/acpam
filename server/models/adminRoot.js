const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let adminRootSchema = new Schema({
    nombres: {
        type: String,
        required: [true, 'El nombre del personal de salud es obligatorio.']
    },
    apellidos: {
        type: String,
        required: [true, 'El apellido del personal de salud es obligatorio.']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    }
});

adminRootSchema.plugin(uniqueValidator, {message: '{Es obligatorio que el valor de {PATH} sea único.'});

module.exports = mongoose.model('AdminRoot', adminRootSchema);