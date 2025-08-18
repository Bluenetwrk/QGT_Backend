const { default: mongoose } = require("mongoose")

const ResumeUpdateSchema = new mongoose.Schema({
    profileData: {
        type: String
    },
    name:{
        type:String
    },
    profileSummary:{
        type: String
    },
    address:{
        type:String
    },
    email:{
        type:String,
        unique: true
    },
    totalExperience:{
        type: string
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
{timestamps:true}
)


const productModel = mongoose.model("ResumeForm" , ResumeUpdateSchema)
module.exports = productModel