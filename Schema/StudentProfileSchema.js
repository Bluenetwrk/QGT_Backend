const mongoose = require("mongoose")

const profileSchema= new mongoose.Schema({
    image : {
        type:String
        // type:Buffer
    },
    Gpicture : { 
        type:String
    },
    userId: {
        type: String
    },
    name:{
        type:String
    },
    city:{
        type:Object
    },
    college:{
        type:Object
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
    },
    LogedInTime:{
        type:Date
    },
    online:{
        type:Boolean
    },
    Tags:[
        
    ],
    tokenNo:[{
        tokenNo:{
        type:Number
    },
        Date:{
            type : Date
        }    
    }
    ],
    profileSummary:{
        type: String
    },
    college:{
        type: String
    },
    HRsEmployerFeedBack:{
        type:String
    },
    address:{
        type:String
    },
    experiences:[{
        company:{
            type: String
        },
        role:{
            type:String
        },
        startDate:{
            type: Date
        },
        endDate:{
            type: Date
        },
        descriptions: [
        
        ]
        }],
        certifications:[

        ],
        skills:[{
            heading:{

            },
            items:{

            }
        }],
        languages:[
        ],
},
{timestamps:true})

const profileModel= mongoose.model("JobSeeker-Profile",profileSchema)

module.exports=profileModel