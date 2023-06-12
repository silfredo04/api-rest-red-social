// importar modelos 
const FollowsModel = require("../models/ModelsFollow");
const Usermodels = require("../models/ModelsUser");

// importar dependencias
const mongoosePaginate = require("mongoose-pagination");

// importar servicios 
const followService = require("../services/followService");

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

 // funcion ontener cantidad de usuarios
async function obtenerCantidadFollows() {
    try {
      const count = await FollowsModel.countDocuments({}).exec();
      return count;
    } catch (error) {
      return 'Error al obtener la cantidad de usuarios:', error;
    }
  }

// Accion listado de usuario que cualquier usuario esta siguiendo (siguiendo)
const lista_user_siguiendo = (req, res) =>{
    // Sacar el id del usuario identificado 

    let usuarioIdentificado = req.user.id;

    // Comprobar si mellega el id por parametros en url 
    let idruta = req.params.id;

    if(idruta) usuarioIdentificado = idruta;
    
    // Comprobar si me llega la pagina, si no la pagina 1 
    let page = 1
    let pageRuta = req.params.page;

    if(pageRuta) page = pageRuta;

    // Usuarios por pagina quiero mostrar 

    let usuariosPorPagina = 5;


    // Find a follow, popular datos de los usuarios y paginar con mongoose paginate
    FollowsModel.find({id_user:usuarioIdentificado})
                .populate("id_user followed","-password -role -__v -email")
                .paginate(page,usuariosPorPagina)
                .then(async (seguidores) => {

                // cantidad seguidores
                let total = await obtenerCantidadFollows();
                // Listado de usuarios de samerito, y soy silfredo
                // Sacar un array de ids de los usuarios que me siguen y los que sigo como silfredo

                let followUserIds = await followService.followUserIds(usuarioIdentificado);
                return res.status(200).json({
                    status: "success",
                    mensaje: "Listado de usuarios que estoy siguiendo",
                    seguidores,
                    total,
                    pages:Math.ceil(total/usuariosPorPagina),
                    user_following:followUserIds.following,
                    user_follow_me:followUserIds.followers
                });
    });
}

// Accion listado de usuario que siguen a cualquier otro usuario (soy seguido, mis seguidores)
const lista_user_me_siguen = (req, res) =>{
    // Sacar el id del usuario identificado 

    let usuarioIdentificado = req.user.id;

    // Comprobar si mellega el id por parametros en url 
    let idruta = req.params.id;

    if(idruta) usuarioIdentificado = idruta;
    
    // Comprobar si me llega la pagina, si no la pagina 1 
    let page = 1
    let pageRuta = req.params.page;

    if(pageRuta) page = pageRuta;

    // Usuarios por pagina quiero mostrar 

    let usuariosPorPagina = 5;

    // Find a follow, popular datos de los usuarios y paginar con mongoose paginate
    FollowsModel.find({followed:usuarioIdentificado})
                .populate("id_user","-password -role -__v -email")
                .paginate(page,usuariosPorPagina)
                .then(async (seguidores) => {

                // cantidad seguidores
                let total = await obtenerCantidadFollows();
                // Listado de usuarios de samerito, y soy silfredo
                // Sacar un array de ids de los usuarios que me siguen y los que sigo como silfredo

                let followUserIds = await followService.followUserIds(usuarioIdentificado);
                return res.status(200).json({
                    status: "success",
                    mensaje: "Listado de usuarios que me siguen",
                    seguidores,
                    total,
                    pages:Math.ceil(total/usuariosPorPagina),
                    user_following:followUserIds.following,
                    user_follow_me:followUserIds.followers
                });
    });
}


// Exportar acciones 

module.exports = {
    prueba_follow,
    guardarSeguidores,
    borrarSeguidores,
    lista_user_siguiendo,
    lista_user_me_siguen
}