// importar modulos 
const jwt = require("jwt-simple");
const moment = require("moment");

// importar clave secreta 
const libjwt = require("../services/jwt");
const claveSecret = libjwt.secret;

// funcion middlewares de acutenticacion 
exports.auth = (req, res, next) =>{
    // comprobar si me llega la cabecera de autenticacion 
    if(!req.headers.authorization){
        return res.status(403).send({
            status:"error",
            message:"La peticion no tiene la cabecera de autenticacion"
        });
    }

    // limpiar el token 
    let token = req.headers.authorization.replace(/['"]+/g,'');

    // Decodificar el token
    try{
        let payload = jwt.decode(token,claveSecret);
        // comprobar expiracion del token
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status:"error",
                message:"Token expirado"
            });
        }
        // agregar datos de usuario a la request
        req.user = payload;
    }catch(error){
        return res.status(404).send({
            status:"error",
            message:"Token invalido",
            error
        });
    }

    // pasar  a ejecucion de accion 
    next();
}
