const express = require('express');
const bcrypt = require('bcrypt');

const Usuarios = require('../models/usuarios');
const AdminRoot = require('../models/adminRoot');
const AdminGAD = require('../models/adminGAD');
const PersonalSalud = require('../models/personalSalud');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.post('/admin-root-7su7', (req, res) => {
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

        let adminRoot = new AdminRoot({
            nombres: body.nombres,
            apellidos: body.apellidos,
            usuario: usuario._id
        });

        adminRoot.save((err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                mensaje: 'Creación de administrador exitosa.'
            });
        });
    });
});

app.get('/verificaToken-7su7', verificaToken, (req, res) => {

    let usuarioDB = getDB(req.usuario.rol);

    usuarioDB.find({})
        .populate({ path: 'usuario', match: { email: req.usuario.email } })
        .exec((err, usuarioData) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            usuarioData = usuarioData.filter(function(usuarios) {
                return usuarios.usuario; 
            });

            res.json({
                ok: true,
                usuarioData,
            });
        });

});

function getDB(rol) {
    if (rol === 'adminRoot') {
        return AdminRoot;
    } else if (rol === 'adminGAD') {
        return AdminGAD;
    } else if (rol === 'adminGAD') {
        return PersonalSalud;
    } else {
        return null;
    }
};

module.exports = app;