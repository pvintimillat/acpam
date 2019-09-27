const express = require('express');
const _ = require('underscore');

const Gads = require('../models/gads');
const { verificaToken, verificaAdminRol} = require('../middlewares/autenticacion');

const app = express();

app.get('/gads', verificaToken, (req, res) => {

    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);

    Gads.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, GADsDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Gads.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(501).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    usuarios: GADsDB,
                    conteo
                });
            });

        });
});

app.post('/gads', [verificaToken, verificaAdminRol], (req, res) => {
    let body = req.body;

    let gads = new Gads({
        nombre: body.nombre,
        direccion: body.direccion,
        horarioAtencion: body.horarioAtencion
    });

    gads.save((err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            mensaje: 'Creación de GAD exitosa.'
        });
    });
})

app.put('/gads/:id', [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;

    let bodyGADs = _.pick(req.body, [
        'nombre',
        'direccion',
        'horarioAtencion',
        'contacto',
    ]);

    Gads.findByIdAndUpdate(id, bodyGADs, { useFindAndModify: false, runValidators: true, context: 'query' }, (err, GADsDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (GADsDB === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Error, el GAD no existe.'
                }
            });
        }

        res.json({
            ok: true,
            mensaje: 'Actualización de GAD exitosa.'
        });

    });
})

app.delete('/gads/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id;

    Gads.findByIdAndUpdate(id, { estado: false }, { useFindAndModify: false, runValidators: true }, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            mensaje: 'Eliminación de GAD exitosa.'
        });
    });

})

module.exports = app;