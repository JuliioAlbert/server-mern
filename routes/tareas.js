const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator')

//Crear Tarea
//api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'El Proyecto es obligatorio').not().isEmpty(),
    ],
    tareaController.crearTarea
);
//Obtener tareas por Proyecto
//api/tareas
router.get('/',
    auth,
    tareaController.obtenerTareas
);

//Actualizar tareas por Proyecto
//api/tareas
router.put('/:id',
    auth,
    tareaController.actualizarTarea
);

//Eliminar tareas por Proyecto
//api/tareas
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);




module.exports = router;


