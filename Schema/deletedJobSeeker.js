const mongoose = require("mongoose")

const DeletedJobSeeker= new mongoose.Schema(
    {
        Archived:{
    type:Object
}
},
{timestamps:true}
)

const profileModel= mongoose.model("Deleted-JobSeeker",DeletedJobSeeker)

module.exports=profileModel