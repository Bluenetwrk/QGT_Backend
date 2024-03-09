const mongoose = require("mongoose")

const profileSchema= new mongoose.Schema({
    image : {
        type:String
    },   
    name:{
        type:String
    },
    email: {
        type: String,
        unique: true
    },
    ipAddress:{
type:String
    },
    message:{
        type:String
    
        },
    phoneNumber:{
        type:String
    },
    Aadhar:{
        type:String
    },
    panCard:{
        type:String
    },
    CompanyGSTIN:{
        type:String
    },
    CompanyName:{
        type:String
    },
    CompanyContact:{
        type:String
    },
    CompanyWebsite :{
        type:String
    },
    CompanyAddress:{
        type:String
    },
    CompanyEmail:{
        type:String
    },
    TypeofOrganisation:{
        type:String
    },
    isApproved:{
        type:Boolean
    },
    isReject:{
        type:Boolean
    },
    isOnhold:{
        type:Boolean

    }

},
{timestamps:true}
)

const profileModel= mongoose.model("Employee-Profile",profileSchema)

module.exports=profileModel