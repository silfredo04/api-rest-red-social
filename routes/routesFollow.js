const express = require("express");
const rutaFollow = express.Router();
const followControllers = require("../controllers/controllersFollow");


// ruta de prueba
rutaFollow.get("/follow/prueba",followControllers.prueba_follow);


module.exports = rutaFollow;