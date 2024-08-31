
const cors = require("cors")
const express = require("express");
const app = express();
const StudentProfileRoutes = require("./Routes/StudentProfileRoutes");
const EmpProfileRoutes = require("./Routes/EmpProfileRoutes");
const jobpostRoutes = require("./Routes/JobpostsRoutes");
const adminRoutes =require("./Routes/AdminRout")
const PaymentRoute = require("./Routes/PaymentRout")
//require("dotenv").config
const { MongoClient } = require("mongodb")
const mongoose = require("mongoose");
//const port = process.env.PORT
const port = 8080
// mongoose.connect(process.env.MONGO_URL)
mongoose.connect("mongodb+srv://blueimpluse:jobportal1234@cluster0.5dgcnm4.mongodb.net/jobportalMern")
// mongoose.connect("mongodb://127.0.0.1:27017/Job-Portal-Database")
    .then((res) => { console.log("connected") })
    .catch(() => { console.log("failed") })

app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use("/StudentProfile",StudentProfileRoutes)
app.use("/EmpProfile",EmpProfileRoutes)
app.use("/jobpost", jobpostRoutes)
app.use("/admin", adminRoutes)
app.use("/paymentAPI", PaymentRoute)

app.use("*", (req, res) => {
    res.send(" Itwalkin could not fetch this API")
})



app.listen(port, () => {
    console.log(`app running on port ${port} for booking`)
})