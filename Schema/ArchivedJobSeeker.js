const mongoose = require("mongoose")

const ArchivedJobSeeker= new mongoose.Schema(
    {
        Archived:{
    type:Object
}
},
{timestamps:true}
)

const profileModel= mongoose.model("Archived-JobSeeker",ArchivedJobSeeker)

module.exports=profileModel