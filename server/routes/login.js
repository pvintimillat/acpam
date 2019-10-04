const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuarios = require('../models/usuarios');
const AdminRoot = require('../models/adminRoot');
const PersonalSalud = require('../models/personalSalud');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuarios.findOne({ email: body.email, estado: true }, { useFindAndModify: false }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Usuario o contraseña incorrectos.'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Usuario o contraseña incorrectos.'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    });
});

module.exports = app;