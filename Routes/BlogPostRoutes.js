
const express = require("express")
const router = express.Router()
const JobpostsModel = require("../Schema/PostJobSchema")
const CareerJobpostsModel = require("../Schema/CareerJobSchema")
const JobAppliedModel = require("../Schema/JobAppliedSchema")
const StudentProfileModel= require("../Schema/StudentProfileSchema")
const Archived= require("../Schema/ArchiveAchema")
const Deleted= require("../Schema/DeletedJobsSchema")
var nodemailer = require('nodemailer');

const { MongoClient } = require("mongodb")
// const {getData} = require("../mongodb")
const {ObjectID} = require("mongodb")
const {gtoken} = require('./EmpProfileRoutes')
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
router.post("/blogpost", verifyToken, async (req, res) => {
    try {
            let jobs = new BlogModel(req.body)
            let result = await jobs.save()
            res.send("success")
        
    } catch (error) {
        // console.log(error.message)
        res.send("server issue ")
    }
})

// ............get all Home jobs for all......
router.get("/getAllBlogs", verifyHomeJobs, async (req, res) => {
    try {
        let jobs = await BlogModel.find().select()
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

//  get job by Tag filter
router.get("/getTagsJobs/:name", async(req, res)=>{
    try{
        let result = await BlogModel.aggregate([{$match:{Tags:req.params.name}}]) 
        //or
    // let result = await JobpostsModel.find({Tags:  req.params.name })
    // let result = await JobpostsModel.find({Tags: {$elemMatch: {value: req.params.name }}}) //this one if for object in array in db
        res.send(result)
    }catch(err){
        res.send("server error")
    }
})

// .........getJobs for job details...........
router.get("/getjobs/:id",verifyHomeJobs, async (req, res) => {
    try {
        let jobs = await BlogModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})


module.exports=router