// const mongoose = require("mongoose");
// const port = 8080
const dotenv =require("dotenv");
dotenv.config();
// function dbconnection(){
    
// mongoose.connect(process.env.URL+'jobportalMern')
// // mongoose.connect("mongodb://127.0.0.1:27017/Job-Portal-Database")
//     .then((res) => { console.log("connected") })
//     .catch((err) => { console.log("failed") }) 
// }

// module.exports=dbconnection

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const router = express.Router()


app.use(express.json()); // Middleware to parse JSON body

router.post("/connect-db", async (req, res) => {
    try {
        // console.log(req.body)
        const  dbName  = req.body.selectedOption.value;
        const dbURI = process.env.URL+`${dbName}`;
        // const dbURI = `mongodb://127.0.0.1:27017/${dbName}`;
        let currentConnectedDb=mongoose.connection.name
        if(currentConnectedDb!==dbName){
            console.log(`Disconnecting from current DB: ${mongoose.connection.name}`);
            await mongoose.disconnect();
        }
        res.send(`DB Connected to ${dbName}`)
        await mongoose.connect(dbURI)            
    .then((res) => {console.log(`DB Connected to ${dbName}`)
  })
    .catch((err) => { console.log("DB Connection Failed",err) })     
    } catch (error) {
        console.log(`some thing went wrong`,error)

    }
});

module.exports=router