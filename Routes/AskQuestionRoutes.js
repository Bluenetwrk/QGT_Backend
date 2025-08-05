
const express = require("express")
const router = express.Router()
const JobpostsModel = require("../Schema/PostJobSchema")
const CareerJobpostsModel = require("../Schema/CareerJobSchema")
const JobAppliedModel = require("../Schema/JobAppliedSchema")
const StudentProfileModel= require("../Schema/StudentProfileSchema")
const Archived= require("../Schema/ArchiveJobsAchema")
const Deleted= require("../Schema/DeletedJobsSchema")
var nodemailer = require('nodemailer');
const AskQuestionModel=require("../Schema/AskQuesionsSchema")

const { MongoClient } = require("mongodb")
// const {getData} = require("../mongodb")
const {ObjectID} = require("mongodb")
const {gtoken} = require('./StudentProfileRoutes')
const secretKey = "abcde"
const jwt = require("jsonwebtoken")

const BlogModel=require("../Schema/PostBlogsSchema")


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
// middleware for 
function verifyHomeJobs(req, res, next){
    let valid=req.headers['authorization']
    if(valid==='BlueItImpulseWalkinIn'){
        next()
}else{
    res.send("Unauthorised Access")
}
}

// employee Blog  postings
router.post("/postQuestion", verifyToken, async (req, res) => {
    try {
            let jobs = new AskQuestionModel(req.body)
            let result = await jobs.save()
            res.send("success")        
    } catch (error) {
        // console.log(error.message)
        res.send("server issue ")
    }
})

// ............get all Home jobs for all......
router.get("/getAllQuestions",verifyToken, async (req, res) => {
    try {
        let jobs = await AskQuestionModel.find().select()
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

//  get job by Tag filter
router.get("/getTagsQuestions/:name", async(req, res)=>{
    try{
        let result = await AskQuestionModel.aggregate([{$match:{Tags:req.params.name}}]) 
        //or
    // let result = await JobpostsModel.find({Tags:  req.params.name })
    // let result = await JobpostsModel.find({Tags: {$elemMatch: {value: req.params.name }}}) //this one if for object in array in db
        res.send(result)
    }catch(err){
        res.send("server error")
    }
})

// .........getJobs for job details...........
router.get("/getQuestions/:id",verifyToken, async (req, res) => {
    try {
        let jobs = await AskQuestionModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})
// ..........update Question............
router.put("/updateQuestion/:id", verifyHomeJobs, async (req, res) => {
    try {
        let result = await AskQuestionModel.updateOne(
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
//............delete posted Questions.........
router.delete("/deleteQuestion/:id",verifyHomeJobs, async (req, res) => {
    let result = await AskQuestionModel.deleteOne({ _id: req.params.id })
    if (result) {
        res.send(result)
    } else {
        res.send("error")
    }
})

module.exports=router