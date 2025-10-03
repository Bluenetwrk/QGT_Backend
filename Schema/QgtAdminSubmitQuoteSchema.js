const mongoose = require("mongoose")
const SellerSchema = new mongoose.Schema({
    
    SellerId: {
        type: String,
    },
    QuoteId: {
        type: String,

    },
    
},
{timestamps:true}
);
const QuotesubmittedModel = mongoose.model("Qgt-Quote-submitted", SellerSchema);

module.exports = QuotesubmittedModel