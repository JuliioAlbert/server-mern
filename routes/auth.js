//rutas para crear autenticar usuarios 
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const autenticarUsuario = require('../controllers/authController');
const auth = require('../middleware/auth');

//Iniciar Sesion de un usuario 
// api/auth

router.post('/',
    autenticarUsuario.autenticarUsuario);


router.get('/',
    auth,
    autenticarUsuario.usuarioAutenticado
);

module.exports = router;