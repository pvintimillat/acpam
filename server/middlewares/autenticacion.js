const jwt = require('jsonwebtoken');
const extras = require('../functions/extras');

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    mensaje: 'El token no es válido.'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });


};

let verificaAdminRol = (req, res, next) => {
    
    let usuario = req.usuario;

    if (usuario.rol === 'adminRoot') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                mensaje: 'El usuario no tienen privilegios de administrador.'
            }
        });
    }
};

let verificaCedula = (req, res, next) => {
    let body = req.body;

    if (body.tipoID === 'Cedula') {
        if (extras.cedulaCorrecta(body.numeroID)) {
            next();
        } else {
            return res.json({
                ok: false,
                err: {
                    mensaje: 'La cédula ingresada no es válida.'
                }
            });
        }
    } else {
        next();
    }
};

module.exports = {
    verificaToken,
    verificaAdminRol,
    verificaCedula
}