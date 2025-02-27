const mongoose = require("mongoose")

const ArchivedEmployee= new mongoose.Schema(
    {
        Archived:{
    type:Object
}
},
{timestamps:true}
)

const profileModel= mongoose.model("Archived-Employee",ArchivedEmployee)

module.exports=profileModel