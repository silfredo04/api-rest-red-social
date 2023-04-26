const express = require("express");
const rutaPublication = express.Router();
const publicationControllers = require("../controllers/ControllersPublication");

// ruta de prueba
rutaPublication.get("/publication/prueba",publicationControllers.prueba_publication);


module.exports = rutaPublication;