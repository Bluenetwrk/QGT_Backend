
const cors = require("cors")
const express = require("express");
const app = express();
const StudentProfileRoutes = require("./Routes/StudentProfileRoutes");
const EmpProfileRoutes = require("./Routes/EmpProfileRoutes");
const jobpostRoutes = require("./Routes/JobpostsRoutes");
const CareerjobpostRoutes = require("./Routes/CareerJobpostsRoutes");
const adminRoutes =require("./Routes/AdminRout")
const PaymentRoute = require("./Routes/PaymentRout")
const StudentProfileModel = require("./Schema/StudentProfileSchema")
const EmployeeProfileModel = require("./Schema/EmpProfileSchema")

//require("dotenv").config
const { MongoClient } = require("mongodb")
const mongoose = require("mongoose");
//const port = process.env.PORT
const port = 8080
mongoose.connect("mongodb+srv://blueimpluse:jobportal1234@cluster0.5dgcnm4.mongodb.net/jobportalMern")
// mongoose.connect("mongodb://127.0.0.1:27017/Job-Portal-Database")
    .then((res) => { console.log("connected") })
    .catch((err) => { console.log("failed") })

app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use("/StudentProfile",StudentProfileRoutes)
app.use("/EmpProfile",EmpProfileRoutes)
app.use("/jobpost", jobpostRoutes)
app.use("/Careerjobpost", CareerjobpostRoutes)
app.use("/admin", adminRoutes)
app.use("/paymentAPI", PaymentRoute)

// app.use("/", (req, res)=>{
//     try{
//     res.send("It-walkin server is up and running")
// }catch(err){
//     res.send(" Itwalkin server is down")
// }
// })

app.use("*", (req, res) => {    
        res.send(" Itwalkin could not fetch this API")    
})

const http = require("http")
const Server=require('socket.io').Server
const server = http.createServer(app)


const io= new Server(server,{
    cors:{
        origin:"*"
    }
})
// const uns=io.of('/student-namespace')

io.on('connection',  async(socket)=>{
    let token = socket.handshake.auth.token    
    let result =await EmployeeProfileModel.findByIdAndUpdate({_id:token},{$set:{online:true}})
    if(result===null){
    let result =await StudentProfileModel.findByIdAndUpdate({_id:token},{$set:{online:true}})
    }
    socket.on("disconnect", async ()=>{        
        let token = socket.handshake.auth.token
        let result =await StudentProfileModel.findByIdAndUpdate({_id:token},{$set:{online:false}})
        if(result===null){
            let result =await EmployeeProfileModel.findByIdAndUpdate({_id:token},{$set:{online:false}})
            }
    })
})

server.listen(port, () => {
    console.log(`app running on port ${port} for booking`)
})