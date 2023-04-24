// acciones de prueba 



const prueba_user = (req,res) =>{
    return res.status(200).send({
        menssage: "Mensaje enviado desde: controller/user.js"
    });
}

// Exportar acciones 

module.exports = {
    prueba_user
}