const mongoose = require("mongoose")

const walkinSchema = new mongoose.Schema({
    Logo:{
    type :String

    },
jobTitle:{
    type :String
},
companyName:{
    type : String
},
applyLink:{
    type : String
},
successMessage:{

},
Adminpost:{
    type:Boolean
},
empId:{
type : String
},
Jobid:{

},
driveId:{

},
profileData:{

},
adminLogin:{
    type : String
},
jobDescription:{
    type : String
},
jobtype:{
    type : String
},
salaryRange:{
    type : String
},
Tags:[
    
],
jobLocation:{
    type : String
},
qualification:{
    type : String
},
experiance:{
    type : String
},
skills:[
    // type : String
 ] ,
 driveDate:{
    type : Date
 },
 selectedDate:{
    type: Date
 },
 venue:{
    type : String
 },
 StartTime:{
    type:String
 },
 EndTime:{
    type:String
 },
 time:{
    type: Date
 },
 concent:{
    type: Boolean
 },
 slectedJobseker:[
],
rejectedJobseker:[
],
onHoldJobseker:[
],
jobSeekerId:[
    {
        jobSeekerId:{
    type : String
        },
        date:{
        type: Date
    }
    },
 ] ,
 WaitingArea:[{
    jobSeekerId:[
        {
            jobSeekerId:{
        type : String
            }
        },
     ] ,
     tokenNo:[
    ],
    createdDateTime:{
        type: Date
    },
    updatedDateTime:{
        type: Date
    },
    }],
    HRCabin:[{
        jobSeekerId:[
            {
                jobSeekerId:{
            type : String
                }
            }, 
         ] ,
         tokenNo:[
        ],
        createdDateTime:{
            type: Date
        },
        updatedDateTime:{
            type: Date
        },
        comment:{
            type: String
        },
        slectedJobseker:[
        ],
        rejectedJobseker:[
        ],
        onHoldJobseker:[
        ]
        
        }],
        InterviewCompleted:[{
            jobSeekerId:[
                {
                    jobSeekerId:{
                type : String
                    }
                }, 
             ] ,
             tokenNo:[
            ],
            createdDateTime:{
                type: Date
            },
            updatedDateTime:{
                type: Date
            }
        }]

},

{timestamps:true}
)
const walkinModel = mongoose.model("WalkinDrives" , walkinSchema)
module.exports = walkinModel