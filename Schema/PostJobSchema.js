const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    Logo:{
    type :String

    },
jobTitle:{
    type :String
},
companyName:{
    type : String
},
SourceLink:{
    type : String
},
Source:{
    type : String
},
SourceCompanyLink:{
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
const productModel = mongoose.model("JobPosts" , productSchema)
module.exports = productModel