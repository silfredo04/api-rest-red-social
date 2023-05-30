// importar modelos 
const FollowsModel = require("../models/ModelsFollow");
const Usermodels = require("../models/ModelsUser");

// acciones de prueba 

const prueba_follow = (req,res) =>{
    return res.status(200).send({
        menssage: "Mensaje enviado desde: controller/follow.js"
    });
}


// Accion de guardar un follow (accion seguir)

const guardarSeguidores = (req,res) =>{

     // Conseguir datos por el body

     const params = req.body;

     // Sacar id del usuario identificado 

     const idUsuarioIdentificado = req.user.id;

     // Crear objeto con modelo follow

     let usuarioAseguir = new FollowsModel({
        id_user:idUsuarioIdentificado,
        followed:params.followed
     });

     // Guardar objeto en base de datos 
     usuarioAseguir.save().then(seguirGuardado => {
        if(!seguirGuardado){
            return res.status(500).json({
                status: "error",
                mensaje: "No se ha podido seguir al usuario"
            });
        }
        // devolver resultado
        return res.status(200).json({
            status: "success",
            message: "Usuario seguido con exito",
            identidad:req.user,
            seguir:seguirGuardado
        });
    }).catch(error => {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al guardar seguidor"
        });
    });
}

// Accion de borrar un follow (accion dejar de seguir)
 const borrarSeguidores = (req,res) =>{
    // Recoger el id del usuario identificado
    const idUsuarioIdentificado = req.user.id;

    // Recoger el id del usuario que quiero dejar de seguir 
    const idaeliminar = req.params.id;

    // Find o encontrar de las coincidencias y hacer remove

    FollowsModel.findOneAndDelete({
        "id_user":idUsuarioIdentificado,
        "followed":idaeliminar
    }).then(eliminarSeguidor => {
        if(!eliminarSeguidor){
            return res.status(500).json({
                status: "error",
                mensaje: "seguidor no encontrado"
            });
        }
        // devolver resultado
        return res.status(200).json({
            status: "success",
            message: "Seguidor eliminado con exito",
        });
    }).catch(error => {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al eliminar seguidor"
        });
    });

 }

// Accion listado de usuario que estouy siguiendo

// Accion de lostado de usuario que me siguen 

// Exportar acciones 

module.exports = {
    prueba_follow,
    guardarSeguidores,
    borrarSeguidores
}