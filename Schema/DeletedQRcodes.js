const mongoose = require("mongoose")

const DeletedQRcodes= new mongoose.Schema(
    {
        Archived:{            
        }
},
{timestamps:true}
)

const profileModel= mongoose.model("Deleted-QRcodes", DeletedQRcodes)

module.exports=profileModel