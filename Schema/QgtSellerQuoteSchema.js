const mongoose = require("mongoose")
const SellerQuoteSchema = new mongoose.Schema({
    SNo:{
        type:Number
    },
    Decription:{
        type : String
    },
    Link:{
        type: String
    },
    HSNcode:{
        type:String
    },
    Quantity:{
        type: String
    },
    UnitPrice:{
        type: String
    },
    TotalPrice:{
        type:String
    },
    BuyerComments:{
        type:String
    },
        SellerId: {
        type: String
    },
    PostedOnDate:{
        type: Date
    },
    UpdatedOnDate:{
        type: Date
    },
    QuoteId: {
        type: String
    },
    Termsandconditions:{
        type: String
    } 
},
{timestamps:true}
);
const SellerQuoteModel = mongoose.model("Qgt-SellerQuote-submitted", SellerQuoteSchema);

module.exports = SellerQuoteModel