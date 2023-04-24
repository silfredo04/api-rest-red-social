// acciones de prueba 

const prueba_follow = (req,res) =>{
    return res.status(200).send({
        menssage: "Mensaje enviado desde: controller/follow.js"
    });
}

// Exportar acciones 

module.exports = {
    prueba_follow
}