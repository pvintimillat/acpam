const express = require('express');
const _ = require('underscore');

const Ancianos = require('../models/ancianos');
const { verificaToken, verificaAdminGADRol, verificaCedula } = require('../middlewares/autenticacion');

const app = express();

app.get('/ancianos', verificaToken, (req, res) => {

    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);

    Ancianos.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, ancianosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Ancianos.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(501).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    usuarios: ancianosDB,
                    conteo
                });
            });

        });
});

app.post('/ancianos', [verificaToken, verificaAdminGADRol, verificaCedula], (req, res) => {
    let body = req.body;

    let ancianos = new Ancianos({
        nombres: body.nombres,
        apellidos: body.apellidos,
        tipoID: body.tipoID,
        numeroID: body.numeroID,
        email: body.email,
        celular: body.celular,
        nombresReferencia: body.nombresReferencia,
        telefonoReferencia: body.telefonoReferencia,
        direccion: body.direccion,
        ocupacion: body.ocupacion,
        genero: body.genero,
        edad: body.edad,
    });

    ancianos.save((err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            mensaje: 'Creación de anciano exitosa.'
        });
    });
})

app.put('/ancianos/:id', [verificaToken, verificaAdminGADRol], (req, res) => {
    let id = req.params.id;

    let bodyAncianos = _.pick(req.body, [
        'nombres',
        'apellidos',
        'tipoID',
        'numeroID',
        'email',
        'celular',
        'nombresReferencia',
        'telefonoReferencia',
        'direccion',
        'ocupacion',
        'edad',
    ]);

    Ancianos.findByIdAndUpdate(id, bodyAncianos, { useFindAndModify: false, runValidators: true, context: 'query' }, (err, ancianoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (ancianoDB === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Error, el usuario no existe.'
                }
            });
        }

        res.json({
            ok: true,
            mensaje: 'Actualización de anciano exitosa.'
        });

    });
})

app.delete('/ancianos/:id', [verificaToken, verificaAdminGADRol], (req, res) => {

    let id = req.params.id;

    Ancianos.findByIdAndUpdate(id, { estado: false }, { useFindAndModify: false, runValidators: true }, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            mensaje: 'Eliminación de anciano exitosa.'
        });
    });

})

module.exports = app;