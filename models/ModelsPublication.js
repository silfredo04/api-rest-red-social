const {Schema,model} = require("mongoose");


const ModelsPublicationSchema = Schema({
    id_user:{
        type: Schema.ObjectId,
        ref: "User"
    },
    text:{
        type:String,
        required:true
    },
    file:{
        type:String,
        default:"default.png"
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});

module.exports = model("Publication",ModelsPublicationSchema,"publications")