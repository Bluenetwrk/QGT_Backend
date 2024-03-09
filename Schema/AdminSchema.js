const mongoose=require("mongoose")

const AdminSchema = new mongoose.Schema({
    email:{
        type:String,
        unique: true

    },
    password:{
        type:String
    }
})
const  AdminModel = mongoose.model("Admin",AdminSchema )

module.exports=AdminModel





