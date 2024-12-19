
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
function verifyHome(req, res, next){
    let valid=req.headers['authorization']
    // console.log(valid)
    if(valid==='BlueItImpulseWalkinIn'){
        next()
}else{
    res.send("Unauthorised Access")
}
}

// employee Blog  postings
router.post("/blogpost",  async (req, res) => {
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
router.get("/getAllBlogs",  async (req, res) => {
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

// ................get my posted Articls and questions for emplyee amd jobseeker.......
router.get("/getPostedjobs/:id", verifyToken, async (req, res) => {
    try {
        let jobs = await BlogModel.find({ empId: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue", err)
    }
})

// .......... get jobs for update for emplyee........
router.get("/getJobForUpdate/:id",verifyToken, async (req, res) => {
    try {
        let jobs = await BlogModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send( err)
    }
})
// ..........update for emplyee job posts............
router.put("/updatPostedJob/:id", verifyToken, async (req, res) => {
    try {
        let result = await BlogModel.updateOne(
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

// ...........delete posted job for employee..............
router.delete("/deleteProduct/:id",verifyToken, async (req, res) => {
    let result = await BlogModel.deleteOne({ _id: req.params.id })
    if (result) {
        res.send(result)
    } else {
        res.send("error")
    }
})

// .........getJobs for job details...........
router.get("/getjobs/:id",verifyHome, async (req, res) => {
    try {
        let jobs = await BlogModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

router.put("/Addcomment/:id", verifyHome, async(req, res)=>{
    try{
        let result= await BlogModel.updateOne(
            {_id:req.params.id},
            {$push:req.body}
        )
        if(result){
            res.send("success")
                }        
    }catch(err){
        res.send("back error occured")
    }
})
router.put("/deletComment/:id", verifyHome, async(req, res)=>{
    // console.log(req.body)
    try{
        let result= await BlogModel.updateOne(
            {_id:req.params.id},
            {$pull: {comments:req.body}}
        )
        // console.log(result)
        if(result){
            res.send("success")
                }        
    }catch(err){
        res.send("back error occured")
    }
})

// Delete any field

// router.put("/deleteComment", async (req, res)=>{
//     console.log("clicked")
//     try{
//         let result= await BlogModel.updateMany({},
//             {$unset:{comments:""}}
//         )
//         console.log(result)

//     }catch(err){
//         res.send("back error occured")
//         console.log(err)

//     }
// })
module.exports=router