const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //Leer token de header 
    const token = req.header('x-auth-token');

    //revisar si no hay token
    if (!token) {
        return res.status(401).json({ ok: false, msj: "No hay Token" });

    }
    //validar el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next();
    } catch (e) {
        res.status(401).json({ ok: false, msj: "Token no valido" });

    }

}