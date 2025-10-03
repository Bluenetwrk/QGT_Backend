const mongoose = require("mongoose")

const ArchivedSeller= new mongoose.Schema(
    {
        Archived:{
    type:Object
}
},
{timestamps:true}
)

const profileModel= mongoose.model("Qgt-Archived-Seller",ArchivedSeller)

module.exports=profileModel