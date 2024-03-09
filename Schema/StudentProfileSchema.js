const mongoose = require("mongoose")

const profileSchema= new mongoose.Schema({
    image : {
        type:String
    },
    userId: {
        type: String
    },
    name:{
        type:String
    },
    email: {
        type: String,
        unique: true
    },
    phoneNumber:{
        type:String
    },
    Aadhar:{
        type:String
    },
message:{
    type:String

    },
    ipAddress:{
        type:String
    },
    panCard:{
        type:String
    },
    NoticePeriod:{
        type:String
    },
    ExpectedSalary :{
        type:String
    },
    currentCTC:{
        type:String
    },
    age:{
        type:String
    },
    Qualification:{
        type:String
    },
    Skills:{
        type:String
    },
    Experiance:{
        type:String
    },
    status:{
       select: {
            type:String}
    },
    select:{
        type:String
    },
    reject:{
        type:String
    },
    Onhold:{
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
{timestamps:true})

const profileModel= mongoose.model("JobSeeker-Profile",profileSchema)

module.exports=profileModel