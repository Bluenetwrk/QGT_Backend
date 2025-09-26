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
    profileData: {
        type: String
    },
    profileSummary:{
        type: String
    },
    city:{
        type:Object
    },
    college:{
        type:Object
    },
    selectedCountry:{

    },
    currentEmp:{

    },
    employers:[

    ],
    Qualification:{

    },
    tenth:{

    },
    twelfth:{

    },
    degree:{

    },
    saveComent:{

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
    imageConsent:{
        type:Boolean
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
    qualificationDetails:[{
        degree:{
            type:String
        },
        score:{
            type:String
        },
        collegeName:{
            type:String
        },
        stateCode:{
            type:String
        },
        countryCode:{
            type:String
        }
    }],
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
    message:{
        type:String
    },
    HRsEmployerFeedBack:[
    
],
    address:{
        type:String
    },
    totalExperience:{
        type: String
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
        interview:[{

            tokenNo:{},
   
            driveId:{},
   
            scannedDateTime:{}
   
}]
},
{timestamps:true})

const profileModel= mongoose.model("JobSeeker-Profile",profileSchema)

module.exports=profileModel