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
Adminpost:{
    type:Boolean
},
empId:{
type : String
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
jobTags:[
    
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
 consent:{
    type: Boolean
 },
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
            },
            date:{
            type: Date
        }
        },
     ] ,
     tokenNo:[
    ]
    }],
    HRCabin:[{
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
         tokenNo:[
        ],
        selectedJobseeker:[
        ],
        rejectedJobseeker:[
        ],
        onHoldJobseeker:[
        ]
        }]
},

{timestamps:true}
)
const walkinModel = mongoose.model("WalkinDrives" , walkinSchema)
module.exports = walkinModel