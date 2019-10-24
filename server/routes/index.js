const express = require('express')

const app = express()

app.use(require('./personalSalud'));
app.use(require('./adminRoot'));
app.use(require('./adminGAD'));
app.use(require('./ancianos'));
app.use(require('./gads'));
app.use(require('./login'));
app.use(require('./upload'));
app.use(require('./images'));

module.exports = app;