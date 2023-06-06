// importar modelos 
const FollowsModel = require("../models/ModelsFollow");

const followUserIds = async (userId) =>{

    try{
        // sacar info seguimiento 
        // los que sigo
        let following = await FollowsModel.find({"id_user":userId}).select({"followed":1,"_id":0}).then((followes) => followes);
        // los que me siguen 
        let followers = await FollowsModel.find({"followed":userId}).select({"id_user":1,"_id":0}).then((followes) => followes);

        // procesar array de identificadores 
        let followingClean = [];

        following.forEach(follow => {
            followingClean.push(follow.followed);
        });

        let followersClean = [];

        followers.forEach(follow => {
            followersClean.push(follow.id_user);
        });

        return {
            following:followingClean,
            followers:followersClean
        };
    }catch(error){
        return {};
    }
    
}

const followThisUser = async (identityUserId,profileUserId) =>{
    // comprobar si el que sigo me sigue 
    let following = await FollowsModel.findOne({"id_user":identityUserId,"followed":profileUserId});
    // comprobar si el que me sigue yo lo sigo 
    let follower = await FollowsModel.findOne({"id_user":profileUserId,"followed":identityUserId});

    return {
        following,
        follower
    };
}

module.exports = {
    followUserIds,
    followThisUser
}