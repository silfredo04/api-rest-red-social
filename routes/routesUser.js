const express = require("express");
const rutasUser = express.Router();
const userControllers = require('../controllers/ControllersUser');

// ruta de prueba
rutasUser.get("/usuario/prueba",userControllers.prueba_user);

// RUTA UTIL
rutasUser.post("/usuario/register",userControllers.register);

module.exports = rutasUser;