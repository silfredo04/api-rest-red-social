const {Schema,model} = require("mongoose");


const ModelsFollowSchema = Schema({
    id_user:{
        type:String
    },
    followed:{
        type:String
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});

module.exports = model("Follow",ModelsFollowSchema,"followed")