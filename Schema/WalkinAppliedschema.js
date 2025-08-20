const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    
    jobSeekerId: {
        type: String,
    },
    driveId: {
        type: String,

    },
    tokenNo:[]
},
{timestamps:true}
);
const WalkinAppliedModel = mongoose.model("Walkins-Applied", userSchema);

module.exports = WalkinAppliedModel