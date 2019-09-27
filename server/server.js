require('./config/config')

const express = require('express')
const mongoose = require('mongoose');

const app = express()

// Configuracion del body-parser para recibir un objeto json post
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes/index'));
 
mongoose.connect('mongodb://localhost:27017/acpam', {useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex: true}, (err) => {
    if (err) throw err;

    console.log('Base de datos ONLINE');
});   
 
app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT}`);
});

