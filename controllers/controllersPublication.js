// importar modelos 
const Publicationmodels = require("../models/ModelsPublication");
// importar modulos
const fs = require("fs");
const path = require("path");
// importar servicios 
const followService = require("../services/followService");




// acciones de prueba 

const prueba_publication = (req,res) =>{
    return res.status(200).send({
        menssage: "Mensaje enviado desde: controller/publication.js"
    });
}

// Guardar publicaciones 

const guardarPublicaciones = (req,res) =>{
    // Recoger datos del body 
    let = text = req.body.text;

    let idUsuarioSesion = req.user.id;

    // Si no me llega dar una respuesta negativa
    if(!text){
        return res.status(400).json({
            status:"error",
            message:"Deves enviar el texto de la publicacion."
        });
    }

    // Crear y rellenar el objeto del modelo
    let nuevaPublicacion = new Publicationmodels({
        id_user:idUsuarioSesion,
        text:text
    });

    // Guardar objeto en la base de datos 
    nuevaPublicacion.save().then((publicacionGuardada)=>{
        if(!publicacionGuardada){
            return res.status(500).json({
                status: "error",
                mensaje: "No se ha podido guardar la publicacion"
            });
        }
        // devolver respuesta
        return res.status(200).json({
            status:"success",
            menssage:"publicacion guardada",
            publicacionGuardada
        });
    }).catch(error => {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al guardar la publicacion"
        });
    });
}

// Listar una publicacion en concreto

const listarUnaPublicacion = (req,res) =>{
    // Sacar id de publicacion de la url
    const publicacionId = req.params.id;
    // Find con la condicion del id 
    Publicationmodels.findById(publicacionId).then((publicacion)=>{
        if(!publicacion){
            return res.status(500).json({
                status: "error",
                mensaje: "No se ha encontrado la publicacion"
            });
        }
        // devolver respuesta
        return res.status(200).json({
            status:"success",
            menssage:"publicacion encontrada",
            publicacion
        });
    }).catch(error => {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al buscar la publicacion"
        });
    });
}

// eliminar publicaciones

const eliminarPublicacion = (req,res) =>{
    // Recoger el id del usuario identificado
    const idUsuarioIdentificado = req.user.id;

    // Recoger el id de la publicacion a eliminar
    const idaeliminar = req.params.id;

    // Find o encontrar de las coincidencias y hacer remove

    Publicationmodels.findOneAndDelete({
        "id_user":idUsuarioIdentificado,
        "_id":idaeliminar
    }).then(eliminarpublicacion => {
        if(!eliminarpublicacion){
            return res.status(500).json({
                status: "error",
                mensaje: "publicacion no encontrada"
            });
        }
        // devolver resultado
        return res.status(200).json({
            status: "success",
            message: "publicacion eliminada con exito",
            publicacion:idaeliminar
        });
    }).catch(error => {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al eliminar publicacion"
        });
    });
}

// funcion ontener cantidad de publicaciones
async function obtenerCantidadPublicaciones() {
    try {
      const count = await Publicationmodels.countDocuments({}).exec();
      return count;
    } catch (error) {
      return 'Error al obtener la cantidad de usuarios:', error;
    }
  }

// Listar publicaciones de un usuario

const listarPublicacioneDeUnUsuario = (req,res) =>{
    // Sacar el identificador del usuario de la url 
    let idusuarioUrl = req.params.id;

    // Controlar la pagina 
    let page = 1;
    if(page) page = req.params.page;

    const itemsPerPage = 5;

    // Find, populate, ordenar, paginar
    Publicationmodels.find({ id_user: idusuarioUrl })
        .sort("-created_at")
        .populate("id_user", "-password -role -__v -email")
        .paginate(page,itemsPerPage)
        .then(async(publicaciones) => {
            if(!publicaciones || publicaciones.length <= 0){
                return res.status(500).json({
                    status: "error",
                    mensaje: "No se han encontrado publicaciones" + error
                });
            }

            // cantidad de usuarios 
            let total = await obtenerCantidadPublicaciones();
            
            return res.status(200).json({
                status: "success",
                menssage:"Publicaciones del perfil de un usuario",
                page,
                total,
                pages:Math.ceil(total/itemsPerPage),
                publicaciones
            });
        })
        .catch(error => {
            return res.status(500).json({
                status: "error",
                mensaje: "error al buscar publicacion" + error
            });
        });
}

// Subir ficheros

const subirFicheros = (req,res) =>{

     // Sacra el id de la publicacion
     let idParametro = req.params.id;
     // Recoger el fichero de imagen subido y comprobar que exixte
     let archivo = req.file;

     if(!archivo && !req.files){
         return res.status(404).json({
             status:"error",
             mensaje:"Peticion invalida"
         });
     }
 
     // Conseguir el Nombre del archivo 
     let nombreArchivo = archivo.originalname;
 
     //Sacar la Extension del archivo
 
     let extensionArchivo_split = nombreArchivo.split("\.");
     let extension = extensionArchivo_split[1];
 
     // Comprobar extension correcta
     if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif"){
         // Borrar archivo y dar respuesta
         const filePath = req.file.path;
         const fileDeleted= fs.unlinkSync(filePath);
         return res.status(400).json({
             status:"error",
             mensaje:"Imagen invalida"
         });
     }else{
         // Recoger id usuario a editar
         let userid = req.user.id;
         // Si todo va bien, actualizar el articulo
         Publicationmodels.findOneAndUpdate({id_user:userid, _id:idParametro},{file:req.file.filename},{new:true}).exec().then(publicacionActualizada => {
             // Devolver respuesta
             if(publicacionActualizada){
                 return res.status(200).json({
                     status: "success",
                     publicacionActualizada,
                     fichero:req.file,
                 });
             }else{
                 return res.status(500).json({
                     status: "error",
                     mensaje: "Usuario no encontrado!!"
                 });
             }
           })
           .catch(error => {
             return res.status(400).json({
                 status: "error",
                 mensaje: "No se ha actualizado el Usuario "+error
             });
           });
     }
}

// Devolver archivos multimedia imagenes

const devolverImagen = (req,res) =>{
    // Sacar el parametro de la url
    let file = req.params.file;

    // Montar el paht real de la imagen
    let ruta_fisica = "./imagenes/publicaciones/"+file;

    // Comprobar si el archivo existe 

    fs.stat(ruta_fisica, (error, existe) =>{
        if(existe){
            // Devolver un file
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe"
            });
        }
    });
}

// funcion ontener cantidad de publicaciones
async function obtenerCantidadPublicaciones() {
    try {
      const count = await Publicationmodels.countDocuments({}).exec();
      return count;
    } catch (error) {
      return 'Error al obtener la cantidad de usuarios:', error;
    }
  }



// Listar todas las publicaciones (FEED)

const listarTodaslasPublicaciones = async (req, res) => {
    // Sacar la pagina actual 
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    // Establecer numero de elementos por pagina
    let numeroElementoPagina = 5;

    // Sacar un array de identificaciones de usuarios que yo sigo como usuario logueado

    try {
        const arry_usuario_que_sigo = await followService.followUserIds(req.user.id);

        // Find a publicaciones utilizando el operador $in, ordenar, popular, paginar
        const publicaciones = await Publicationmodels.find({ id_user: { "$in": arry_usuario_que_sigo.following } })
            .populate("id_user", "-password -role -__v -email")
            .sort("-created_at")
            .paginate(page,numeroElementoPagina);



        if(!publicaciones || publicaciones.length <= 0){
            return res.status(500).json({
                status: "error",
                menssage: "No hay publicaciones para mostrar"
            });
        }


        let total = await obtenerCantidadPublicaciones();

        return res.status(200).json({
            status: "success",
            menssage: "success listar Todas las publicacion",
            following: arry_usuario_que_sigo.following,
            total,
            pages:Math.ceil(total/numeroElementoPagina),
            publicaciones
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            menssage: "No se han listado las publicaciones del feed"
        });
    }
}



// Exportar acciones 

module.exports = {
    prueba_publication,
    guardarPublicaciones,
    listarUnaPublicacion,
    eliminarPublicacion,
    listarTodaslasPublicaciones,
    listarPublicacioneDeUnUsuario,
    subirFicheros,
    devolverImagen
}