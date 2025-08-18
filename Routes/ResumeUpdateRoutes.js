const express = require("express")
const router = express.Router()
const StudentProfileModel= require("../Schema/StudentProfileSchema")
const JobpostsModel = require("../Schema/PostJobSchema")
const walkinpostsModel = require("../Schema/PostWalkinSchema")
const WalkinAppliedModel = require("../Schema/WalkinAppliedschema")
const mongoose = require("mongoose");

 const { MongoClient } = require("mongodb")
 // const {getData} = require("../mongodb")
 const {ObjectID} = require("mongodb")
 const {gtoken} = require('./StudentProfileRoutes')
 const secretKey = "abcde"
 const jwt = require("jsonwebtoken")

 // Middleware
 function verifyToken(req, res, next){
     if(req.headers['authorization']){
     let token = req.headers['authorization'].split(" ")[1]
     let id = req.headers['authorization'].split(" ")[0]
     if(token){
         jwt.verify(token, secretKey, (err, valid)=>{
     if(err){
         res.send("invalid token")
         }else{
     let validid=valid.id
     if(validid===id){
         next()
     }
         }   })
     }else{
         res.send("Unauthorised Access")
     }
 }
 }
function verifyHomeJobs(req, res, next){
    let valid=req.headers['authorization']
    if(valid==='BlueItImpulseWalkinIn'){
        next()
}else{
    res.send("Unauthorised Access")
}
}

// update resume

router.put("/updateResume/:id", verifyHomeJobs, async (req, res) => {
    try {
        let result = await StudentProfileModel.updateOne(
           { _id: req.params.id},
           {$set:req.body}
         )
        if (result) {
            res.send("success")
        }         
    } catch (err) {
        res.send("back end error occured")
    }
})
