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


// Admin Career job postings
router.post("/Careerjobpost", verifyToken, async (req, res) => {
    try {
        const {Logo, empId, companyName, jobTitle, jobDescription, jobtype, 
            salaryRange, jobLocation, qualification, experiance, skills } = (req.body)
        if ( !jobDescription || !companyName || !experiance || !jobLocation) {
            res.send("field are missing")
        } else {
            let jobs = new CareerJobpostsModel(req.body)
            let result = await jobs.save()
            res.send("success")
        }
    } catch (error) {
        // console.log(error.message)
        res.send("server issue ")
    }
})
// get all jobs........
router.get("/getCareerjobs", verifyHomeJobs, async (req, res) => {

    try {
        let jobs = await CareerJobpostsModel.find().select()
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// ............for job details............

router.get("/getjobDetails/:id",verifyHomeJobs, async (req, res) => {
    try {
        let jobs = await CareerJobpostsModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// get tag filtered jobs.......
router.get("/getTagsJobs/:name", async(req, res)=>{
    try{
        let result = await CareerJobpostsModel.aggregate([{$match:{Tags:req.params.name}}])
    // let result = await CareerJobpostsModel.find({Tags: {$elemMatch: {value: req.params.name,label: req.params.name }}})

        res.send(result)
    }catch(err){
        res.send("server error")
    }
})


// ..........update for job applyjobs for job seeker..................
router.put("/updatforJobApply/:id", verifyToken, async (req, res) => {
    let userId  = req.body.jobSeekerId
    try {
        let result = await CareerJobpostsModel.updateOne(
           { _id: req.params.id},
           {$push: {jobSeekerId:req.body}}
         )
         let job = await CareerJobpostsModel.findOne({_id:req.params.id})
         let JobTile = job.jobTitle
        if (result) {
        let user =  await StudentProfileModel.findOne({ _id:userId})
        let Usermail  =user.email
        if(Usermail){        
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
       user: 'bluenetwrk@gmail.com',
      pass: 'vwzv axcq ywrw bxjd'
                }
              });
              var mailOptions = {
                from: 'bluenetwrk@gmail.com',
                to: Usermail,
                subject: `Succesfully Applied for the Job ${JobTile}`,
                text: "you have applied for job successfully",
                html: `You have Succesfully Applied for the Job ${JobTile}`+'<p>Click <a href="https://itwalkin-frontend.vercel.app/Jobdetails/' + btoa(req.params.id) + '"> here </a> to check the full details about the applied Job</p>'
                // context:paymentResult
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log("mail not sent",error);
                } else {
                  res.send(" mail sent succesfully")

                }
              });
        }
        }    
                //   res.send(" mail sent succesfully")

    } catch (err) {
        res.send("back end error occured")
    }
})

// ...........delete posted job for employee..............
router.delete("/deleteJobs/:id",verifyHomeJobs, async (req, res) => {
    let result = await CareerJobpostsModel.deleteOne({ _id: req.params.id })
    if (result) {
        res.send(result)
    } else {
        res.send("error")
    }
})

//  get user id's for who has applied for job from a single job
router.get("/getAppliedUserIds/:id", async(req,res)=>{
    try{
        let JobIds= await CareerJobpostsModel.findOne({_id:req.params.id})
        if(JobIds){
            res.send(JobIds)
        }else{
            res.send("not found")
        }
    }catch(err){
        res.send("server error occured")
    }
})

// .select , reject, onhold..............
router.put("/status/:id", async(req, res)=>{
    try{
        let result= await CareerJobpostsModel.updateOne(
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

// ................get jobs for myappliedjobs for jobseeker.......
router.get("/getMyAppliedjobs/:id", verifyToken, async (req, res) => {
    try {
        // let jobs = await JobpostsModel.find({jobSeekerId: req.params.id })
    let jobs = await CareerJobpostsModel.find({jobSeekerId: {$elemMatch: {jobSeekerId: req.params.id }}})
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// .......Undo Select , Reject, OnHold.............
router.put("/updatforUndoJobApplied/:id", async (req, res) => {
    try {
        let result = await CareerJobpostsModel.updateOne(           
            {_id: req.params.id}, 
            {$pull:req.body}
         )
        if (result) {
            res.send("success")
        }                     
    } catch (err) {
        res.send("back end error occured")
    }
})

// .......upate for undoJobApply..or delete Job Applied...........

router.put("/DeleteJobApplied/:id", async (req, res) => {
    try {
        let result = await CareerJobpostsModel.updateOne(           
            {_id: req.params.id}, 
            {$pull:{jobSeekerId:req.body}}  )
        if (result) {
            res.send("success")
        }                     
    } catch (err) {
        res.send("back end error occured")
    }
})


module.exports = router