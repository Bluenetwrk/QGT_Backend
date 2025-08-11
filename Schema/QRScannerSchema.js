const { default: mongoose } = require("mongoose")

const QRScannerSchema = new mongoose.Schema({
    tokenNo:[{
        tokenNo:{
        type:Number
    },
        Date:{
            type : Date
        }    
    }
    ],
    profile_data:{
        type: String
    },
    createdDateTime:{
        type: Date
    },
    updatedDateTime:{
        type: Date
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

const productModel = mongoose.model("QRcodes" , QRScannerSchema)
module.exports = productModel