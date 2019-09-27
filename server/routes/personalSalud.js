const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const PersonalSalud = require('../models/personalSalud');
const Usuarios = require('../models/usuarios');
const { verificaToken, verificaAdminRol, verificaCedula } = require('../middlewares/autenticacion');

const app = express();

app.get('/personalSalud', verificaToken, (req, res) => {

    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);

    PersonalSalud.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuariosPersonalSalud) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            PersonalSalud.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(501).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    usuarios: usuariosPersonalSalud,
                    conteo
                });
            });

        });
});

app.post('/personalSalud', [verificaToken, verificaAdminRol, verificaCedula], (req, res) => {
    let body = req.body;

    let usuarios = new Usuarios({
        email: body.email,
        password: bcrypt.hashSync(body.password, 13),
        rol: body.rol,
    });

    usuarios.save((err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        console.log(usuario._id);

        let personalSalud = new PersonalSalud({
            nombres: body.nombres,
            apellidos: body.apellidos,
            tipoID: body.tipoID,
            numeroID: body.numeroID,
            estudios: body.estudios,
            especialidad: body.especialidad,
            senescyt: body.senescyt,
            email: body.email,
            celular: body.celular,
            consultorio: body.consultorio,
            rol: body.rol,
        });

        personalSalud.save((err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                mensaje: 'Creación de personal de salud exitosa.'
            });
        });
    });
})

app.put('/personalSalud/:id', [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;
    
    let bodyPersonalSalud = _.pick(req.body, [
        'nombres',
        'apellidos',
        'tipoID',
        'numeroID',
        'senescyt',
        'email',
        'celular',
        'consultorio',
        'img',
    ]);

    let bodyUsuario = _.pick(req.body, [
        'email'
    ]);

    PersonalSalud.findByIdAndUpdate(id, bodyPersonalSalud, { useFindAndModify: false, runValidators: true }, (err, personalSaludDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuarios.findOneAndUpdate({ email: personalSaludDB.email }, bodyUsuario, { useFindAndModify: false, runValidators: true }, (err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                mensaje: 'Actualización de personal de salud exitosa.'
            });
        });
    });
})

app.delete('/personalSalud/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id;

    PersonalSalud.findByIdAndUpdate(id, { estado: false }, { useFindAndModify: false, runValidators: true }, (err, personalSaludDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuarios.findOneAndUpdate({ email: personalSaludDB.email }, { estado: false }, { useFindAndModify: false, runValidators: true }, (err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                mensaje: 'Eliminación de personal de salud exitosa.'
            });
        });
    });
})

module.exports = app;