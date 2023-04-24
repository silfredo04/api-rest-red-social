// importar dependencias 
const {connection} = require("./database/connection");
const express = require("express");
const cors = require("cors");

// Conexion a la base de datos
connection();

// Mensaje de bienvenida
console.log("API NODE para RED SOCIAL arrancada!!");

// Crear servidor node
const app = express();
const puerto = 3900;

// Configurar cors
app.use(cors());

// Convertir los datos que lleguen en cada peticion datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Cargar configuracion de rutas

// ruta de prueba
app.get("/ruta-prueba",(req,res) => {
    return res.status(200).json({
        "id":1,
        "Nombre":"Silfredo orozco",
        "Web":"sorozco25"
    })
})

// Poner el servidor a escuchar peticiones http
app.listen(puerto,() => {
    console.log("Servidor de node corriendo en el puerto: "+puerto)
});