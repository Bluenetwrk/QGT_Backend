const mongoose = require("mongoose")

const PaymentShema = new mongoose.Schema({
    EmployeeId:{
        type:String
    },
    amount:{
        type:String
    },
    amountPaid:{
        type:String
    },
    amountDue:{
        type:String
    },
    currency:{
        type:String
    // },
    // PaymentTime:{
    //     type:Date
    },
    ReceiptId:{
        type:String
    }
},
{timestamps:true}
)

const paymentModel = mongoose.model("Payments", PaymentShema)
module.exports = paymentModel