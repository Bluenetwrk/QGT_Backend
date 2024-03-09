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
empId:{
type : String
},
adminLogin:{
    type : String
},
jobDescription:{
    type : Array
},
jobtype:{
    type : String
},
salaryRange:{
    type : String
},
jobLocation:{
    type : String
},
qualification:{
    type : String
},
experiance:{
    type : String
},
skills:{
    type : String
} ,
jobSeekerId:[
]  ,
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