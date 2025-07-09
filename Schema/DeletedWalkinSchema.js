const mongoose = require("mongoose")

const DeletedWalkin= new mongoose.Schema(
    {
        Archived:{            
        }
},
{timestamps:true}
)

const profileModel= mongoose.model("Deleted-Walkins", DeletedWalkin)

module.exports=profileModel