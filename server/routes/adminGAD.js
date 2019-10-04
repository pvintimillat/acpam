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

    AdminGAD.find({})
        .skip(desde)
        .limit(limite)
        .populate({path: 'usuario', match: {estado: true}})
        .exec((err, usuariosAdminGAD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            AdminGAD.countDocuments({rol: 'personalSalud', estado: true}, (err, conteo) => {
                if (err) {
                    return res.status(501).json({
                        ok: false,
                        err
                    });
                }

                usuariosAdminGAD = usuariosAdminGAD.filter(function(usuarioAdminGAD) {
                    return usuarioAdminGAD.usuario; // return only users with email matching 'type: "Gmail"' query
                });

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

    usuarios.save((err, usuario) => {
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
            celular: body.celular,
            usuario: usuario._id
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
        'celular',
        'img',
    ]);

    let bodyUsuario = _.pick(req.body, [
        'email'
    ]);

    AdminGAD.findByIdAndUpdate(id, bodyAdminGAD, { useFindAndModify: false, runValidators: true}, (err, adminGADDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (adminGADDB === null ) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Error, el usuario no existe.'
                }
            });
        }

        Usuarios.findByIdAndUpdate(adminGADDB.usuario, bodyUsuario, { useFindAndModify: false, runValidators: true, context: 'query'}, (err) => {
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

    AdminGAD.findById(id, (err, adminGADDB) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (adminGADDB === null ) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Error, el usuario no existe.'
                }
            });
        }

        Usuarios.findByIdAndUpdate(adminGADDB.usuario, { estado: false }, { useFindAndModify: false, runValidators: true }, (err) => {
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