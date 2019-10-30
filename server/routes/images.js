const express = require('express');

const fs = require('fs');
const path = require('path');

let app = express();

app.get('/imagen/:tipo/:img', (req,res) => {


    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/fotoPerfil/${tipo}/${img}`);
    
    if(fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen)
    } else{
        let pathNoImg = path.resolve(__dirname,'../assets/no-image.jpg');
        res.sendFile(pathNoImg);
    }
    
});

module.exports = app;