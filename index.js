
const cors = require("cors")
const express = require("express");
const app = express();
const QgtBuyerProfileRoutes = require("./Routes/QgtBuyerProfileRoute")
const QgtSellerProfileRoutes = require("./Routes/QgtSellerProfileRoute")
const QgtAdminQuotesRoutes = require("./Routes/QgtAdminQuoteRoute")
const QgtAdminRoutes = require("./Routes/QgtAdminRoute")
const QgtBlogPostRoutes = require("./Routes/QgtBlogPostRoutes")
const QgtSellerQuoteRoute = require("./Routes/QgtSellerQuoteRoute")
const QgtBuyerRequestRoute = require("./Routes/QgtBuyerRequestRoute")
const QgtSellerProfileModel = require("./Schema/QgtSellerProfileSchema")
const QgtBuyerProfileModel = require("./Schema/QgtBuyerProfileSchema")

const port = 8085
const { MongoClient } = require("mongodb")
const dbconnection=require('./Dbconnection')
dbconnection()
// dbconnection()
app.use(express.json())
app.use(cors())
const fs = require("fs")

app.use(express.static('public'))
app.use("/QgtSellerProfile", QgtSellerProfileRoutes)
app.use("/QgtBuyerProfile", QgtBuyerProfileRoutes)
app.use("/QgtBuyerRequest", QgtBuyerRequestRoute)
app.use("/QgtBlogRoute", QgtBlogPostRoutes)
app.use("/QgtSellerQuote", QgtSellerQuoteRoute)
app.use("/QgtadminQuote", QgtAdminQuotesRoutes)
app.use("/QgtAdminRoute", QgtAdminRoutes)

app.use("*", (req, res) => {    // if no API are made 
        res.send(" Quote generator could not fetch this API")    
})


const http = require("http")
const Server=require('socket.io').Server
const server = http.createServer(app)


const io= new Server(server,{
    cors:{
        origin:"*",
        credentials:true
    }
})
// const uns=io.of('/student-namespace')

io.on('connection', async (socket) => {
  try {
    const token = socket.handshake.auth.token;
    let result = await QgtBuyerProfileModel.findByIdAndUpdate({ _id: token }, { $set: { online: true } });
    if (!result) {
      result = await QgtSellerProfileModel.findByIdAndUpdate({ _id: token }, { $set: { online: true } });
    }
  } catch (err) {
    console.error("Socket connection error:", err.message);
  }

  socket.on("disconnect", async () => {
    try {
      const token = socket.handshake.auth.token;
      let result = await QgtSellerProfileModel.findByIdAndUpdate({ _id: token }, { $set: { online: false } });
      if (!result) {
        result = await QgtBuyerProfileModel.findByIdAndUpdate({ _id: token }, { $set: { online: false } });
      }
    } catch (err) {
      console.error("Socket disconnect error:", err.message);
    }
  });
});

server.listen(port, () => {
    console.log(`app running on port ${port} for Quote generator`)
})
