const mongoose = require("mongoose")

const DeletedSeller= new mongoose.Schema(
    {
        Archived:{            
        }
},
{timestamps:true}
)

const profileModel= mongoose.model("Qgt-Deleted-Seller", DeletedSeller)

module.exports=profileModel