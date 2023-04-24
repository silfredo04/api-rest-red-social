const mongoose = require("mongoose");


const connection = async() =>{
    try{
        await mongoose.connect("mongodb://localhost:27017/mi_redsocial");
        console.log("Conectado correctamente a la base de datos mi_redsocial");
    }catch(error){
        console.log(error);
        // lansamos una excepción 

        throw new Error("No se a podido conectar a la base de datos !!")
    }
}

module.exports = {
    connection
}