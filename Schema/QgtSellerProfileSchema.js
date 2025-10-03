const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
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
    CompanyCIN:{
        type:String
    },
    AboutCompany:{
        type:String
    },
    secondaryuserDesignation:{
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
    CompanyLocation:{
        type:String
    },
    CompanyEmail:{
        type:String
    },
    TypeofOrganisation:{
        type:String
    },
    Item:{
        type:String
    },
    Price:{
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

const sellerprofileModel = mongoose.model("Qgt-Seller-Profile", profileSchema)

module.exports = sellerprofileModel