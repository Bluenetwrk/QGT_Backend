const mongoose = require("mongoose")

const DeletedQuotes= new mongoose.Schema(
    {
        Archived:{
    
}
},
{timestamps:true}
)

const profileModel= mongoose.model("Qgt-Archived-Quotes", DeletedQuotes)

module.exports=profileModel