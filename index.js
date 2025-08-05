
const cors = require("cors")
const express = require("express");
const app = express();
const StudentProfileRoutes = require("./Routes/StudentProfileRoutes");
const EmpProfileRoutes = require("./Routes/EmpProfileRoutes");
const jobpostRoutes = require("./Routes/JobpostsRoutes");
const BlockRoutes = require("./Routes/BlogPostRoutes");
const CareerjobpostRoutes = require("./Routes/CareerJobpostsRoutes");
const adminRoutes =require("./Routes/AdminRout")
const PaymentRoute = require("./Routes/PaymentRout")
const StudentProfileModel = require("./Schema/StudentProfileSchema")
const EmployeeProfileModel = require("./Schema/EmpProfileSchema")
const QuestionRoute=require("./Routes/AskQuestionRoutes")
const WalkinPostRoutes = require("./Routes/WalkinPostRoutes");
const QRscannerRoutes = require("./Routes/QRscannerRoutes")

const port = 8080
const { MongoClient } = require("mongodb")
const dbconnection=require('./DbConnection')
dbconnection()
// dbconnection()
app.use(express.json())
app.use(cors())

const fs=require("fs")
app.use(express.static('public'))
app.use("/StudentProfile",StudentProfileRoutes)
app.use("/EmpProfile",EmpProfileRoutes)
app.use("/jobpost", jobpostRoutes)
app.use("/BlogRoutes",BlockRoutes)
app.use("/QuestionRoute",QuestionRoute)
app.use("/walkinRoute", WalkinPostRoutes)
app.use("/QRscannerRoutes", QRscannerRoutes)
app.use("/Careerjobpost", CareerjobpostRoutes)
app.use("/admin", adminRoutes)
app.use("/paymentAPI", PaymentRoute)



app.use("*", (req, res) => {    // if no API are made 
        res.send(" Itwalkin could not fetch this API")    
})


const http = require("http")
const Server = require('socket.io').Server
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
