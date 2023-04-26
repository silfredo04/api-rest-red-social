// Importar dependencias y modulos 
const bcrypt = require("bcrypt");
const Usermodels = require("../models/ModelsUser");
// acciones de prueba 

const prueba_user = (req, res) => {
    return res.status(200).send({
        menssage: "Mensaje enviado desde: controller/user.js"
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

// Exportar acciones 

module.exports = {
    prueba_user,
    register
}