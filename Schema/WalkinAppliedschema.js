const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    
    jobSeekerId: {
        type: String,
    },
    jobId: {
        type: String,

    },
    
},
{timestamps:true}
);
const WalkinAppliedModel = mongoose.model("Walkin-Applied", userSchema);

module.exports = WalkinAppliedModel