const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator')
//Crear Proyecto
//
// api/proyectos
router.post('/',
    auth, [
    check('nombre', 'El nombre del Proyecto es obligatorio').not().isEmpty(),
],
    proyectoController.crearProyecto);

router.get('/',
    auth,
    proyectoController.obtenerProyectos);

//Actualizar Proyecto
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del Proyecto es obligatorio').not().isEmpty(),
    ],
    proyectoController.actualizarProyectos);
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto);




module.exports = router;