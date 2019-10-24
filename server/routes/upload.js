const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const PersonalSalud = require('../models/personalSalud');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo.'
                }
            })
    }

    let tiposValidos = ['adminRoot', 'adminGAD', 'personalSalud', 'anciano'];

    if( tiposValidos.indexOf(tipo) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length-1]

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if( extensionesValidas.indexOf(extension) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
            },
            ext: extension
        })
    }

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/fotoPerfil/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
          return res.status(500).json({
              ok: false,
              err
          });
    
        imagenPersonalSalud(id, res, nombreArchivo);
      });

});

function imagenPersonalSalud(id, res, nombreArchivo) {

    PersonalSalud.findById(id, (err, usuarioDB) => {

        console.log(usuarioDB);
        if(err) {
            borraArchivo(nombreArchivo, 'personalSalud');
            return res.status(500).json({
                ok: 'false',
                err
            })
        }

        if(!usuarioDB) {
            borraArchivo(nombreArchivo, 'personalSalud');
            return res.status(400).json({
                ok: 'false',
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        console.log(usuarioDB.img);
        borraArchivo(usuarioDB.img, 'personalSalud');
        console.log(nombreArchivo);
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            
            if(err) {
                return res.status(500).json({
                    ok: 'false',
                    err
                })
            }
            
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        })


    })
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/fotoPerfil/${tipo}/${nombreImagen}`);

        if(fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
}

module.exports = app;