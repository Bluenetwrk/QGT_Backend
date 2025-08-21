const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    
    jobSeekerId:[
        {
            jobSeekerId:{
        type : String
            },
            date:{
            type: Date
        },
        tokenNo:[

        ]
        },
     ] ,
    JobId: [

    ],
    
},
{timestamps:true}
);
const WalkinAppliedModel = mongoose.model("Walkins-Applied", userSchema);

module.exports = WalkinAppliedModel