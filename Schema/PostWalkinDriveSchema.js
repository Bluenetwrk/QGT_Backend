const mongoose = require("mongoose")

const walkindriveSchema = new mongoose.Schema({
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
 venue:{
    type : String
 },
 time:{
    type:String
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
    {
}
    
 ] ,
slectedJobseker:[
],
rejectedJobseker:[
],
onHoldJobseker:[
]

},

{timestamps:true}
)
const walkindriveModel = mongoose.model("WalkinDrives" , walkindriveSchema)
module.exports = walkindriveModel