const express = require("express")
const router = express.Router()
// const JobpostsModel = require("../Schema/PostJobSchema")
 const AdmingetQuoteModel = require("../Schema/QgtAdminRequestQuoteSchema")
// const JobAppliedModel = require("../Schema/JobAppliedSchema")
// const StudentProfileModel= require("../Schema/StudentProfileSchema")
const Archived= require("../Schema/QgtArchieveQuotesSchema")
const Deleted= require("../Schema/QgtDeletedQuotesSchema")
var nodemailer = require('nodemailer');

const { MongoClient } = require("mongodb")
// const {getData} = require("../mongodb")
const {ObjectID} = require("mongodb")
const {gtoken} = require('./QgtBuyerProfileRoute')
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
            let jobs = new AdmingetQuoteModel(req.body)
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
        let jobs = await AdmingetQuoteModel.find().select()
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// ............for job details............

router.get("/getjobDetails/:id",verifyHomeJobs, async (req, res) => {
    try {
        let jobs = await AdmingetQuoteModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// get tag filtered jobs.......
router.get("/getTagsJobs/:name", async(req, res)=>{
    try{
        let result = await AdmingetQuoteModel.aggregate([{$match:{Tags:req.params.name}}])
    // let result = await AdmingetQuoteModel.find({Tags: {$elemMatch: {value: req.params.name,label: req.params.name }}})

        res.send(result)
    }catch(err){
        res.send("server error")
    }
})


// ..........update for job applyjobs for job seeker..................
router.put("/updatforJobApply/:id", verifyToken, async (req, res) => {
    let userId  = req.body.jobSeekerId
    try {
        let result = await AdmingetQuoteModel.updateOne(
           { _id: req.params.id},
           {$push: {jobSeekerId:req.body}}
         )
         let job = await AdmingetQuoteModel.findOne({_id:req.params.id})
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
    let result = await AdmingetQuoteModel.deleteOne({ _id: req.params.id })
    if (result) {
        res.send(result)
    } else {
        res.send("error")
    }
})

//  get user id's for who has applied for job from a single job
router.get("/getAppliedUserIds/:id", async(req,res)=>{
    try{
        let JobIds= await AdmingetQuoteModel.findOne({_id:req.params.id})
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
        let result= await AdmingetQuoteModel.updateOne(
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
    let jobs = await AdmingetQuoteModel.find({jobSeekerId: {$elemMatch: {jobSeekerId: req.params.id }}})
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// .......Undo Select , Reject, OnHold.............
router.put("/updatforUndoJobApplied/:id", async (req, res) => {
    try {
        let result = await AdmingetQuoteModel.updateOne(           
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
        let result = await AdmingetQuoteModel.updateOne(           
            {_id: req.params.id}, 
            {$pull:{jobSeekerId:req.body}}  )
        if (result) {
            res.send("success")
        }                     
    } catch (err) {
        res.send("back end error occured")
    }
})

// .......... get jobs for update for emplyee........
router.get("/getJobForUpdate/:id", verifyHomeJobs, async (req, res) => {
    try {
        let jobs = await AdmingetQuoteModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send( err)
    }
})
// ..........update for emplyee job posts............
router.put("/updatPostedJob/:id", verifyHomeJobs, async (req, res) => {
    try {
        let result = await AdmingetQuoteModel.updateOne(
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


router.get("/getTotalCount", async(req, res)=>{
    try{
       let result =await AdmingetQuoteModel.estimatedDocumentCount()
       res.status(200).send({"result":result})
    }catch(err){
       res.status(401).send({"result":"server issue"})
    }
})
//  get job by Tag filter
router.get("/getTagsJobs/:name", async(req, res)=>{
    let comingParam=req.params.name
    let convertingArray=comingParam.split(",")
    // console.log(convertingArray)
    try{
        let result = await AdmingetQuoteModel.aggregate([
            // {$match:{Tags:req.params.name}},
            {$match:{Tags:{$in:convertingArray}}},
            { $project: { _id: 1, createdAt: 1 } }
        ])
    // console.log(result)
    res.send(result)
    }catch(err){
        res.send("server error")
        console.log(err)
    }
})

router.get("/jobTagsIds/:id", async (req, res) => {
    let limitValue = (parseInt(req.query.recordsPerPage))
    let page = (parseInt(req.query.currentPage))
    // console.log(page)
    // console.log(limitValue)
    let comingArray = req.params.id
    let spliArray = comingArray.split(",")

    try {
        // console.log("local value",['6533629f105bb11463d44bb4', '652f76a8eff06fe23539e03d','652f73966749e34e868567e1'])
        const profile = await AdmingetQuoteModel.find({ _id: { $in: spliArray } })
        .sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
        if (profile) {
            res.send(profile)

        } else {
            res.send("not found")
        }

    } catch (err) {
        res.send("server error occured")
        console.log(err)
    }
})




module.exports = router