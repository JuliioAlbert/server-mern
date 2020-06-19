const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {
    //Revisar errores 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() }).status(400);
    }


    try {
        //crear Proyecto 
        const proyecto = new Proyecto(req.body);

        //Guardar el creador por jwt
        proyecto.creador = req.usuario.id;

        proyecto.save();
        res.status(200).json({
            ok: true,
            proyecto
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            ok: false,
            msj: "Error "
        })
    }
}

//Obtiene todos los proyecto del usuario Actual 

exports.obtenerProyectos = async (req, res) => {
    try {

        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json({
            proyectos
        });

    } catch (e) {
        console.log(e);
        res.status(500).json('Hubo un erro');
    }

}

//Actualizar Proyectos 

exports.actualizarProyectos = async (req, res) => {
    //Revisar errores 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() }).status(400);
    }
    //Extraer la informacion 
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre
    }

    try {
        //Revisar id
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no 
        if (!proyecto) {
            return res.status(404).json({ msj: "Proyecto no encontrado" });
        }
        //verificar el creador del proyecto 


        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msj: "No autorizado" });

        }


        //Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });
        res.json({
            ok: true,
            proyecto
        }).status(200);
    } catch (error) {
        console.log('Error');
        res.status(500).send('Error en el servidor');

    }
}

exports.eliminarProyecto = async (req, res) => {


    try {
        //Revisar id
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no 
        if (!proyecto) {
            return res.status(404).json({ msj: "Proyecto no encontrado" });
        }
        //verificar el creador del proyecto 


        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msj: "No autorizado" });

        }
        //Eliminar el proyecto 

        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({
            ok: true,
            msj: "Proyecto Eliminado"
        })


    } catch (error) {
        console.log('Error');
        res.status(500).send('Error en el servidor');

    }
}