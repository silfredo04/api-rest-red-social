const express = require("express");
const rutaPublication = express.Router();
const publicationControllers = require("../controllers/ControllersPublication");
const check = require("../middlewares/auth"); // metodos de autenticacion 
const multer = require("multer"); // se encarga subir archivos o imagenes al servidor 


// Configuracion de suvida
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imagenes/publicaciones/");
    },
    filename:(req, file, cb) => {
        cb(null, "publicacion-"+Date.now()+"-"+file.originalname);
    }
});

const subida = multer({storage:almacenamiento});

// ruta de prueba
rutaPublication.get("/publication/prueba",publicationControllers.prueba_publication);

// RUTA UTIL

rutaPublication.post("/publication/guardarpublicaciones",check.auth,publicationControllers.guardarPublicaciones);
rutaPublication.get("/publication/listarunapublicacion/:id",check.auth,publicationControllers.listarUnaPublicacion);
rutaPublication.delete("/publication/eliminarpublicacion/:id",[check.auth],publicationControllers.eliminarPublicacion);
rutaPublication.get("/publication/listarpublicaciondeunusuario/:id/:page?",check.auth,publicationControllers.listarPublicacioneDeUnUsuario);
rutaPublication.get("/publication/listartodaslaspublicaciones",check.auth,publicationControllers.listarTodaslasPublicaciones);
rutaPublication.post("/publication/subirficheros/:id",[check.auth, subida.single("file0")], publicationControllers.subirFicheros);
rutaPublication.get("/publication/devolverimagen/:file",publicationControllers.devolverImagen);
rutaPublication.get("/publication/listartodaslaspublicaciones/:page?",check.auth,publicationControllers.listarTodaslasPublicaciones);

module.exports = rutaPublication;