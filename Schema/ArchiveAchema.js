const mongoose = require("mongoose")

const DeletedJobs= new mongoose.Schema(
    {
        Archived:{
    
}
},
{timestamps:true}
)

const profileModel= mongoose.model("Archived-Jobs", DeletedJobs)

module.exports=profileModel