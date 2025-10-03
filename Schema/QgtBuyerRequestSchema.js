const mongoose = require("mongoose")
const buyerRequestSchema = new mongoose.Schema({
    SL_No:{
        type : Number
    },
    Item:{
        type : String
    },
    Description:{
        type : String
    },
    ReferenceLink:{
        type : String 
    },
    Quantity:{
        type : String
    },
    Unit:{
        type : String
    },
    Comment:{
        type : String
    },
    Termsandconditions:{
        type : String
    },
    AdminQuote:{
        type:Boolean
    },
    PostedOnDate:{
        type: Date
    },
    BuyerId:{
    type : String
    },
    adminLogin:{
        type : String
    },
    SellerId:[
        {
            SellerId:{
        type : String
            },
            date:{
            type: Date
        }
        },
        {
    }
        
     ] ,
    selectedSeller:[
    ],
    rejectedSeller:[
    ],
    onHoldSeller:[
    ]
},
{timestamps:true}
)
const buyerRequestModel = mongoose.model("Qgt-BuyerRequest", buyerRequestSchema)
module.exports = buyerRequestModel