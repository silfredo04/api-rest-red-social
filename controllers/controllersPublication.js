// acciones de prueba 



const prueba_publication = (req,res) =>{
    return res.status(200).send({
        menssage: "Mensaje enviado desde: controller/publication.js"
    });
}

// Exportar acciones 

module.exports = {
    prueba_publication
}