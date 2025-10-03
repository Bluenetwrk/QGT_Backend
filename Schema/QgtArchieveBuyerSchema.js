const mongoose = require("mongoose")

const ArchivedBuyer= new mongoose.Schema(
    {
        Archived:{
    type:Object
}
},
{timestamps:true}
)

const profileModel= mongoose.model("Qgt-Archived-Buyer",ArchivedBuyer)

module.exports=profileModel