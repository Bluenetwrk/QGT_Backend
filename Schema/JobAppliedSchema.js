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
const JobAppliedModel = mongoose.model("Job-Applied", userSchema);

module.exports = JobAppliedModel