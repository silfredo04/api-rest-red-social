const express = require("express");
const rutaFollow = express.Router();
const followControllers = require("../controllers/ControllersFollow");
const check = require("../middlewares/auth"); // metodos de autenticacion 


// ruta de prueba
rutaFollow.get("/follow/prueba",followControllers.prueba_follow);

// RUTA UTIL
rutaFollow.post("/follow/guardarseguidores",[check.auth],followControllers.guardarSeguidores);
rutaFollow.delete("/follow/borrarseguidores/:id",[check.auth],followControllers.borrarSeguidores);
rutaFollow.get("/follow/listarusuariosiguiendo/:id?/:page?",[check.auth],followControllers.lista_user_siguiendo);
rutaFollow.get("/follow/listarusuariomesiguen/:id?/:page?",[check.auth],followControllers.lista_user_me_siguen);

module.exports = rutaFollow;