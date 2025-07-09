const mongoose = require("mongoose")

const ArchievedWalkin= new mongoose.Schema(
    {
        Archived:{
    
}
},
{timestamps:true}
)

const profileModel= mongoose.model("Archived-Walkins", ArchievedWalkin)

module.exports=profileModel