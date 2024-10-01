const mongoose = require("mongoose")

const profileSchema= new mongoose.Schema(
    {
        Archived:{
    type:Object
}
},
{timestamps:true}
)

const profileModel= mongoose.model("JobSeeker-Archive",profileSchema)

module.exports=profileModel