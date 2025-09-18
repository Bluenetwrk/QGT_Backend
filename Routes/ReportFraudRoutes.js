const express = require("express")
const router = express.Router()

const reportFraudModel = require("../Schema/FraudformSchema")

var nodemailer = require('nodemailer')
const mongoose = require("mongoose")

const { MongoClient } = require("mongodb")
// const {getData} = require("../mongodb")
const {ObjectID} = require("mongodb")
//const {gtoken} = require('./EmpProfileRoutes')
//const {gtoken} = require('./StudentProfileRoutes')
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

//submit fraud report form
router.post("/reportFraud",verifyToken, async (req, res) => {
    try {
        let jobs = new reportFraudModel(req.body)
        let result = await jobs.save()
        res.send("success")
    
} catch (error) {
    // console.log(error.message)
    res.send("server issue ")
}
})
//Get all reported frauds
router.get("/getAllreportedFrauds", verifyHomeJobs, async (req, res) => {
    try {
        let jobs = await reportFraudModel.find()
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})
//  get job by Tag filter
router.get("/getTagsFraudReport/:name", async(req, res)=>{
    try{
        let result = await reportFraudModel.aggregate([{$match:{Tags:req.params.name}}]) 
        //or
    // let result = await JobpostsModel.find({Tags:  req.params.name })
    // let result = await JobpostsModel.find({Tags: {$elemMatch: {value: req.params.name }}}) //this one if for object in array in db
        res.send(result)
    }catch(err){
        res.send("server error")
    }
})

// .........getJobs for job details...........
router.get("/getfraudreport/:id",verifyHomeJobs, async (req, res) => {
    try {
        let jobs = await reportFraudModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

module.exports = router