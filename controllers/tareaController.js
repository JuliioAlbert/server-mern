const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');




exports.crearTarea = async (req, res) => {

    //Revisar si hay errores 
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }



    try {
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {
            return res.status(404).json({
                msj: "Proyecto no encontrado"
            });
        }

        //Revisar si el proyecto actual pertenece a el usuario autenticado 

        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msj: "No autorizado" });

        }

        //Creamos tarea 
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.status(200).json({
            ok: true,
            tarea
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({ msj: "Erro" })
    }
}
exports.obtenerTareas = async (req, res) => {

    //Extraemos Proyecto

    try {
        const { proyecto } = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {
            return res.status(404).json({
                msj: "Proyecto no encontrado"
            });
        }

        //Revisar si el proyecto actual pertenece a el usuario autenticado 
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msj: "No autorizado" });
        }

        //Obtener Tareas 
        const tareas = await Tarea.find({ proyecto });
        res.status(200).json({
            ok: true,
            tareas
        })


    } catch (error) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

exports.actualizarTarea = async (req, res) => {

    try {
        const { proyecto, nombre, estado } = req.body;
        //Si la tarea existe o no 
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msj: 'No Existe la Tarea' });
        }
        const existeProyecto = await Proyecto.findById(proyecto);
        //Revisar si el proyecto actual pertenece a el usuario autenticado 
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msj: "No autorizado" });
        }

        //Crear un objeto 
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar Tarea 
        tarea= await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});
        res.json({
            tarea
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}
exports.eliminarTarea = async (req, res) => {

    try {
        const { proyecto } = req.query;
        //Si la tarea existe o no 
        let tareaExiste = await Tarea.findById(req.params.id);
        if (!tareaExiste) {
            return res.status(404).json({ msj: 'No Existe la Tarea' });
        }
        const existeProyecto = await Proyecto.findById(proyecto);
        //Revisar si el proyecto actual pertenece a el usuario autenticado 
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msj: "No autorizado" });
        }

        //Eliminar 
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({
            msj:"Tarea Eliminada"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}