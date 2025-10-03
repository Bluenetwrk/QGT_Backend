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
    PrimeryuserDesignation:{
        type:String
    },
    Secondaryusername:{
        type:String
    },
    Secondaryuseremailid:{
        type:String
    },
    Secondaryusercontactnumber:{
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
    },
    LogedInTime:{
        type:Date
    },
    online:{
        type:Boolean
    }
},
{timestamps:true}
)

const NewBuyerprofileModel = mongoose.model("Qgt-New-Buyer-Registration",profileSchema)

module.exports = NewBuyerprofileModel