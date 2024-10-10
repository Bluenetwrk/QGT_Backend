const mongoose = require("mongoose")

const DeletedJobs= new mongoose.Schema(
    {
        Archived:{
    type:Object
}
},
{timestamps:true}
)

const profileModel= mongoose.model("Deleted-Jobs", DeletedJobs)

module.exports=profileModel