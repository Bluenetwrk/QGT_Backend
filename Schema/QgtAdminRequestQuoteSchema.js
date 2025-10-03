const mongoose = require("mongoose")
const AdmingetquoteSchema = new mongoose.Schema({
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
const AdmingetQuoteModel = mongoose.model("Qgt-GetQuote", AdmingetquoteSchema)
module.exports = AdmingetQuoteModel