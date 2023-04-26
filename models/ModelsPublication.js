const {Schema,model} = require("mongoose");


const ModelsPublicationSchema = Schema({
    text:{
        type:String,
        required:true
    },
    file:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    id_user:{
        type:String
    }
});

module.exports = model("Publication",ModelsPublicationSchema,"publications")