const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.autenticarUsuario = async (req, res) => {
    //Revisar si hay errores 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() }).status(400);
    }

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msj: "No existe ese usuario"
            })
        }
        //Revisar su password 
        const passCorrecto = await bcrypt.compare(`${password}`, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({ ok: false, msj: "Password Incorrecto" });
        }

        //crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;

            res.json({ token });
        });

    } catch (e) {
        console.log(e);
    }


}

exports.usuarioAutenticado = async (req, res) => {

    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({
            ok: true,
            usuario
        });
    } catch (e) {
        res.status(500).json({
            msj: 'Hubo un error'
        })
    }
}
