// Importar dependencias y modulos 
const bcrypt = require("bcrypt");
const momgoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");
// importar modelos 
const Usermodels = require("../models/ModelsUser");

// importar servicios 
const jwt = require("../services/jwt");
// acciones de prueba 

const prueba_user = (req, res) => {
    return res.status(200).send({
        menssage: "Mensaje enviado desde: controller/user.js",
        usuario:req.user
    });
}

// Registro de usuario
const register = (req, res) => {
    // Recoger datos de la peticion
    let parametros = req.body;

    // Comprobar que me llega bien (+ validacion)
    if (!parametros.name || !parametros.email || !parametros.password || !parametros.nick) {
        // devolver resultado
        return res.status(400).json({
            status: "error",
            message: "Faltandatos por enviar"
        });
    }

    // Control de usuarios duplicados 
    Usermodels.find({
        $or: [
            { email: parametros.email.toLowerCase() },
            { nick: parametros.nick.toLowerCase() },
        ]
    }).then(async (users) => {
        if (users && users.length >= 1) {
            return res.status(200).json({
                status: "success",
                message: "El susuario ya existe"
            });
        }
        // Cifrar la contraseña

        let pwd = await bcrypt.hash(parametros.password, 10);
        parametros.password = pwd;

        // Cifrar contraseña de otra forma
        /*  bcrypt.hash(user_to_save.password,10,(error,pwd)=>{
             user_to_save.password = pwd;
             console.log(user_to_save);
         }); */

        // Crear Objeto del usuario
        let user_to_save = new Usermodels(parametros);

        // Guardar usuario en la base de datos

        user_to_save.save().then(usersStored => {
            // devolver resultado
            return res.status(200).json({
                status: "success",
                message: "Usuario registrado con exito",
                usersStored
            });
        }).catch(error => {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al guardado el usuario " + error
            });
        });
    }).catch(error => {
        if (error) return res.status(500).json({ status: "error", message: "Error en la consulta" });
    });
}

// login

const login = (req, res) => {

    // recoger los parametros del body 

    let parametros = req.body;

    // validar si los datos llegan 

    if (!parametros.email || !parametros.password) {
        return res.status(400).send({
            status: "Error",
            message: "Faltan datos por enviar"
        })
    }

    // buscar en la base de datos si existe 

    Usermodels.findOne({ email: parametros.email })/* .select({"password":0}) */.then(user => {
        if(!user){
            return res.status(404).json({
                status: "Error",
                mensaje: "No existe el usuario "
            });
        }
        // Comprobar su contraseña
        let pwd = bcrypt.compareSync(parametros.password,user.password);
        if(!pwd){
            return res.status(200).json({
                status: "error",
                message: "no te has identificado correctamente"
            });
        }
        // Conseguir Token

        const token = jwt.createToken(user);

        // devolver datos del usuario 
        return res.status(200).json({
            status: "success",
            message: "Te has identificado correctamente",
            user:{
                id:user._id,
                name:user.name,
                nick:user.nick
            },
            token
        });
    }).catch(error => {
        return res.status(404).json({
            status: "Error",
            mensaje: "No existe el usuario " + error
        });
    });

}

const getUserid = (req,res) =>{
    // Recibir  el parametro del id de usuario por la url
    const id = req.params.id;

    // Consulta para sacar los datos del usuario
    Usermodels.findById(id).select({password:0,role:0}).then(getuserid => {
        if(!getuserid){
            return res.status(404).json({
                status: "Error",
                mensaje: "No existe el usuario o hay un error"
            });
        }
        
        // devolver el resultado
        // Posteriromente: devolver informacion de follows
        return res.status(200).json({
            status: "success",
            getuserid
        });
    }).catch(error => {
        return res.status(404).json({
            status: "Error",
            mensaje: "No existe el usuario " + error
        });
    });
    // Devolver el resultado
}

// funcion ontener cantidad de usuarios
async function obtenerCantidadUsuarios() {
    try {
      const count = await Usermodels.countDocuments({}).exec();
      return count;
    } catch (error) {
      return 'Error al obtener la cantidad de usuarios:', error;
    }
  }

const listarUser = (req, res) => {

    // Controlar en que pagina estamos
    let page = 1;
    if(req.params.page){
        page = req.params.page;
    }
     
    page = parseInt(page);

    // Consultar con mongoose paginate
    let itemsPerpage = 5;

    Usermodels.find().sort('_id').paginate(page,itemsPerpage).then(async (users) => {
        if(!users){
            return res.status(404).json({
                status: "Error",
                mensaje: "No hay usuarios disponibles"
            });
        }   
         
        // cantidad de usuarios 
        let total = await obtenerCantidadUsuarios();
        
        // Devolver el resultado (Posteriormente info follow)
        return res.status(200).json({
            status: "success",
            users,
            page,
            itemsPerpage,
            total,
            pages:Math.ceil(total/itemsPerpage)
        });
    }).catch(error => {
        return res.status(404).json({
            status: "Error",
            mensaje: "No existe el usuario " + error
        });
    });
}

const ActualizarUsuarios = (req, res) => {

    // Recogger info del usuario a actualizar 

    let identidaUsuario = req.user;

    let UsuarioActualizar = req.body;

    //Eliminar campos sobrantes
    delete UsuarioActualizar.iat;
    delete UsuarioActualizar.exp;
    delete UsuarioActualizar.role;
    delete UsuarioActualizar.imagen;

    // Comprobar si el usuario ya existe 
    Usermodels.find({
        $or: [
            { email: UsuarioActualizar.email.toLowerCase() },
            { nick: UsuarioActualizar.nick.toLowerCase() },
        ]
    }).then(async (users) => {
        let userIsset = false;

        users.forEach(user =>{
            if(user && user._id != identidaUsuario.id) userIsset = true;
        });
        if (userIsset) {
            return res.status(200).json({
                status: "success",
                message: "El susuario ya existe"
            });
        }
        // Cifrar la contraseña
        if(UsuarioActualizar.password){
            let pwd = await bcrypt.hash(UsuarioActualizar.password, 10);
            UsuarioActualizar.password = pwd;
        }

        // Buscar y actualizar 
        Usermodels.findByIdAndUpdate(identidaUsuario.id,UsuarioActualizar,{new:true}).then((usuarioActualizado)=>{

            if(!usuarioActualizado){
                return res.status(500).json({
                    status: "error",
                    message:"error al actualizar el usuario"
                });
            }
            // devolver respuesta
            return res.status(200).json({
                status: "success",
                message:"Ruta de actualizada",
                usuarioActualizado
            });
        });
    });
}

const motarFotoUsuario = (req,res) =>{

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
        /* fs.unlink(req.file.path, (error) =>{
            return res.status(400).json({
                status:"error",
                mensaje:"Imagen invalida"
            });
        }); */
    }else{
        // Recoger id articulo a editar
        let userid = req.user.id;
        // Si todo va bien, actualizar el articulo
        Usermodels.findOneAndUpdate({_id:userid},{image:req.file.filename},{new:true}).exec().then(usuarioActualizado => {
            // Devolver respuesta
            if(usuarioActualizado){
                return res.status(200).json({
                    status: "success",
                    usuarioActualizado,
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

} // fin montar foto a usuario

const obtenerImagenAvatar = (req,res) =>{

    // Sacar el parametro de la url
    let file = req.params.file;

    // Montar el paht real de la imagen
    let ruta_fisica = "./imagenes/avatares/"+file;

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
} // fin imagen

// Exportar acciones 

module.exports = {
    prueba_user,
    register,
    login,
    getUserid,
    listarUser,
    ActualizarUsuarios,
    motarFotoUsuario,
    obtenerImagenAvatar
}