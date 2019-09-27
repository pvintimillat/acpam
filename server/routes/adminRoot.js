const express = require('express');
const bcrypt = require('bcrypt');

const AdminRoot = require('../models/adminRoot');
const Usuarios = require('../models/usuarios');

const app = express();

app.post('/admin-root-7su7', (req, res) => {
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

        let adminRoot = new AdminRoot({
            nombres: body.nombres,
            apellidos: body.apellidos,
            email: body.email,
            rol: body.rol
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
})

module.exports = app;