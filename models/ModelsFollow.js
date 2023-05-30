const {Schema,model} = require("mongoose");


const ModelsFollowSchema = Schema({
    id_user:{
        type: Schema.ObjectId,
        ref: "User"
    },
    followed:{
        type: Schema.ObjectId,
        ref: "User"
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});

module.exports = model("Follow",ModelsFollowSchema,"follows")