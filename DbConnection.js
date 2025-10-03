const mongoose = require("mongoose");
const port = 8085
const dotenv = require("dotenv");
dotenv.config();
function dbconnection(){
    
mongoose.connect(process.env.URL)
.then((res) => { console.log("connected") })
.catch((err) => { console.log("failed") }) 
 }

module.exports=dbconnection