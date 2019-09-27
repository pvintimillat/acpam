const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let gadsSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del GAD es obligatorio.']
    },
    direccion: {
        type: String,
        required: [true, 'La dirección del GAD es obligatoria.']
    },
    horarioAtencion: {
        type: String,
        required: [true, 'El horario de atención del GAD es obligatorio.']
    },
    administrador: {
        type: Schema.Types.ObjectId,
        ref: 'AdminGAD'
    },
    estado: {
        type: Boolean,
        default: true,
    }
});

gadsSchema.plugin(uniqueValidator, {message: '{Es obligatorio que el valor de {PATH} sea único.'});

module.exports = mongoose.model('GADS', gadsSchema);