const mongoose = require("mongoose")

const DeletedJobs= new mongoose.Schema(
    {
        Archived:{            
        }
},
{timestamps:true}
)

const profileModel= mongoose.model("Deleted-Jobs", DeletedJobs)

module.exports=profileModel