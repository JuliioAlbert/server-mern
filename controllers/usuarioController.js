const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //extraer email pasword;
    //Revisar si hay errores 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() }).status(400);
    }


    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msj: 'Ya existe el usuario'
            })
        }


        //Crea Usuario
        usuario = new Usuario(req.body);

        //hashear Password
        const salt = await bcrypt.genSaltSync(10);

        usuario.password = await bcrypt.hashSync(`${password}`, salt);

        //guardar Usuario
        await usuario.save();

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
            res.json({
                ok: true,
                token,
                usuario
            });
        });

        //Mensaje de confirmacion

    } catch (error) {
        console.log(error);
        res.status(400).json({ msj: 'Hubo un error en la BD' });
    }

}