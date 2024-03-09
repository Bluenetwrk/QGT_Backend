const mongoose = require("mongoose")

const AdminSchema = new mongoose.Schema({
    AboutUs:{
        type: Array

    }, Services:{
        type: Array

    }, Contact:{
        type: Array

    },
     TermsAndCondition:{
        type: Array

     }
},
{timestamps:true}
)
const AdminUpdateModel= mongoose.model("Admin-Update-Website", AdminSchema )

module.exports=AdminUpdateModel

