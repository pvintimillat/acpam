const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const AdminGAD = require('../models/adminGAD');
const Usuarios = require('../models/usuarios');
const {verificaToken, verificaAdminRol, verificaCedula} = require('../middlewares/autenticacion');

const app = express();

app.get('/adminGAD', verificaToken, (req, res) => {

    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);

    AdminGAD.find({estado: true})
        .skip(desde)
        .limit(limite)
        .exec((err, usuariosAdminGAD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            AdminGAD.countDocuments({estado: true}, (err, conteo) => {
                if (err) {
                    return res.status(501).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    usuarios: usuariosAdminGAD,
                    conteo
                });
            });

        });
});
  
app.post('/adminGAD', [verificaToken, verificaAdminRol, verificaCedula], (req, res) => {
    let body = req.body;

    let usuarios = new Usuarios({
        email: body.email,
        password: bcrypt.hashSync(body.password, 13),
        rol: body.rol,
    });

    usuarios.save((err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        let adminGAD = new AdminGAD({
            nombres: body.nombres,
            apellidos: body.apellidos,
            tipoID: body.tipoID,
            numeroID: body.numeroID,
            email: body.email,
            celular: body.celular,
            rol: body.rol,
        });

        adminGAD.save((err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }    
            res.json({
                ok: true,
                mensaje: 'Creación de administrador de GAD exitosa.'
            });
        });
    });
})
     
app.put('/adminGAD/:id', [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;
    let bodyAdminGAD = _.pick(req.body, [
        'nombres',
        'apellidos',
        'tipoID',
        'numeroID',
        'email',
        'celular',
        'img',
    ]);

    let bodyUsuario = _.pick(req.body, [
        'email'
    ]);

    AdminGAD.findByIdAndUpdate(id, bodyAdminGAD, {useFindAndModify: false, runValidators: true}, (err, adminGADDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuarios.findOneAndUpdate({ email: adminGADDB.email }, bodyUsuario, {useFindAndModify: false, runValidators: true}, (err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                mensaje: 'Actualización de administrador de GAD exitosa.'
            });
        });
    });
})
  
app.delete('/adminGAD/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id;

    AdminGAD.findByIdAndUpdate(id, {estado: false}, {useFindAndModify: false, runValidators: true}, (err, adminGADDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuarios.findOneAndUpdate({ email: adminGADDB.email }, {estado: false}, {useFindAndModify: false, runValidators: true}, (err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                mensaje: 'Eliminación de administrador de GAD exitosa.'
            });
        });
    });
})

module.exports = app;