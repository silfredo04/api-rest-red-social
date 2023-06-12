const express = require("express");
const rutasUser = express.Router();
const userControllers = require('../controllers/ControllersUser');
const check = require("../middlewares/auth"); // metodos de autenticacion 
const multer = require("multer"); // se encarga subir archivos o imagenes al servidor 


// Configuracion de suvida
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imagenes/avatares/");
    },
    filename:(req, file, cb) => {
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
});

const subida = multer({storage:almacenamiento});

// ruta de prueba
rutasUser.get("/usuario/prueba",check.auth,userControllers.prueba_user);

// RUTA UTIL
rutasUser.post("/usuario/register",userControllers.register);
rutasUser.post("/usuario/login",userControllers.login);
rutasUser.get("/usuario/getuser/:id",check.auth,userControllers.getUserid);
rutasUser.get("/usuario/listarusuarios/:page?",check.auth,userControllers.listarUser);
rutasUser.put("/usuario/actualizarusuario",check.auth,userControllers.ActualizarUsuarios);
rutasUser.post("/usuario/montarfotousuario",[check.auth, subida.single("file0")], userControllers.motarFotoUsuario);
rutasUser.get("/usuario/obtenerimagenavatar/:file",userControllers.obtenerImagenAvatar);
rutasUser.get("/usuario/contadores/:id",check.auth,userControllers.contadores);

module.exports = rutasUser;