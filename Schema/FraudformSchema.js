const mongoose = require("mongoose")

const ReportFraud = new mongoose.Schema({
    misuseType:{

    },
    selectedOption:{

    },
    issues:{

    },
    showSuccessMessage:{

    }
},
{timestamps:true})

const reportFraudModel = mongoose.model("Reported-Frauds", ReportFraud)
module.exports = reportFraudModel