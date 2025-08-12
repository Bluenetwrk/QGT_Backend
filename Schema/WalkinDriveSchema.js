const mongoose = require("mongoose")

const walkinDrive = new mongoose.Schema({

jobId:[

],
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
