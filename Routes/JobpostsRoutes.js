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


// ............get all jobs for all......
router.get("/getjobs", verifyToken, async (req, res) => {
    try {
        let jobs = await JobpostsModel.find()
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

function verifyHomeJobs(req, res, next){
    let valid=req.headers['authorization']
    if(valid==='BlueItImpulseWalkinIn'){
        next()
}else{
    res.send("Unauthorised Access")
}
}
// ............get all Home jobs for all......
router.get("/getHomejobs", verifyHomeJobs, async (req, res) => {
    try {
        let jobs = await JobpostsModel.find().select()
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})
// ............get all Home jobs for all......
router.get("/getAdminjobs", verifyHomeJobs, async (req, res) => {
    try {
        let result = await JobpostsModel.aggregate([{ $match: { Adminpost: true } }])
        res.send(result)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// employee job postings
router.post("/jobpost", verifyToken, async (req, res) => {
    try {
        const {Logo, empId, companyName, jobTitle, jobDescription, jobtype, 
            salaryRange, jobLocation, qualification, experiance, skills } = (req.body)
        if ( !jobDescription || !companyName || !experiance || !jobLocation) {
            res.send("field are missing")
        } else {
            let jobs = new JobpostsModel(req.body)
            let result = await jobs.save()
            res.send("success")
        }
    } catch (error) {
        // console.log(error.message)
        res.send("server issue ")
    }
})


// .........getJobs for job details...........
router.get("/getjobs/:id",verifyHomeJobs, async (req, res) => {
    try {
        let jobs = await JobpostsModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// ................get my posted jobs for emplyee.......
router.get("/getPostedjobs/:id", verifyToken, async (req, res) => {
    try {
        let jobs = await JobpostsModel.find({ empId: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue", err)
    }
})
// .......... get jobs for update for emplyee........
router.get("/getJobForUpdate/:id",verifyToken, async (req, res) => {
    try {
        let jobs = await JobpostsModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send( err)
    }
})
// ..........update for emplyee job posts............
router.put("/updatPostedJob/:id", verifyToken, async (req, res) => {
    try {
        let result = await JobpostsModel.updateOne(
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
    let result = await JobpostsModel.deleteOne({ _id: req.params.id })
    if (result) {
        res.send(result)
    } else {
        res.send("error")
    }
})

// .............Search.................
router.get("/searchJob/:key", async(req,res)=>{
    try{
    let result = await JobpostsModel.find({
        "$or" : [
           {jobTitle: {$regex: req.params.key}},
           {empId : {$regex : req.params.key}},
           {jobDescription:{$regex:req.params.key}},
           {jobtype :{$regex:req.params.key}},
           {salaryRange :{$regex:req.params.key}},
           {qualification :{$regex:req.params.key}},
           {experiance :{$regex:req.params.key}},
           {skills :{$regex:req.params.key}},
           {jobLocation:{$regex:req.params.key}},
           {companyName:{$regex:req.params.key}}
    ]
    })
    if(result){
        res.send(result)
    } 
}catch(err){
    res.send("error occured")
}   
})


// ..........update for job applyjobs for job seeker..................
router.put("/updatforJobApply/:id", verifyToken, async (req, res) => {
    let userId  = req.body.jobSeekerId
    try {
        let result = await JobpostsModel.updateOne(
           { _id: req.params.id},
           {$push: {jobSeekerId:req.body}}
         )
         let job = await JobpostsModel.findOne({_id:req.params.id})
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
// ................get jobs for myappliedjobs for jobseeker.......
router.get("/getMyAppliedjobs/:id", verifyToken, async (req, res) => {
    try {
        // let jobs = await JobpostsModel.find({jobSeekerId: req.params.id })
    let jobs = await JobpostsModel.find({jobSeekerId: {$elemMatch: {jobSeekerId: req.params.id }}})

        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// .......upate for undoJobApply.............

router.put("/updatforUndoJobApplied/:id", async (req, res) => {
    try {
        let result = await JobpostsModel.updateOne(           
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
//  get user id's for who has applied for job from a single job
router.get("/getAppliedUserIds/:id", async(req,res)=>{
    try{
        let JobIds= await JobpostsModel.findOne({_id:req.params.id})
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
        let result= await JobpostsModel.updateOne(
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

// ....delete job for admin....
router.delete("/deleteJob/:id", async (req, res) => {
    let result = await JobpostsModel.deleteOne({ _id: req.params.id })
    if (result) {
        res.send(result)
    } else {
        res.send("error")
    }
})

// today Posted Jobs
var start = new Date();  
start.setUTCHours(0,0,0,0);

var end = new Date();
end.setUTCHours(23,59,59,999);

let startDay =start.toUTCString() 
let endDay=end.toUTCString()

router.get("/getTodayPostedJobs", async(req, res)=>{ 
    try{
        let result = await JobpostsModel.find({ createdAt: {$gte: startDay, $lte:endDay} })
        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")

    }
})
// get Job Title  form 
router.get("/getjobTitle/:id", async(req, res)=>{
    // console.log(req.params.id)
    try{
        let result = await JobpostsModel.find({"$or":[{jobTitle:{$regex:req.params.id}}]})
        if(result){
            res.send(result)
        }
    }catch(err){
        res.send("backend error ")
    }
})

// get  getjobLocation  form 
router.get("/getjobLocation/:id", async(req, res)=>{
    try{
        let result = await JobpostsModel.find({"$or":[{jobLocation:{$regex:req.params.id}}]})
        if(result){
            res.send(result)
        }
    }catch(err){
        res.send("backend error ")
    }
})
// get both jobLocation and JobTitle form 

router.post("/getBothjobFilter/:id", async(req, res)=>{
    let LocationParams = req.params.id
    let TitleBody = req.body

    try{
          if(LocationParams && TitleBody)
           {
            let both=   await JobpostsModel.find({$and: [{jobLocation: {$regex:req.params.id}},{jobTitle: {$regex:req.body.jobTitle}}]})
        if(both){
            res.send(both)
        }
           }             
    }catch(err){
        res.send("backend error ")
        // console.log(err)
    }
})

//  pagination , get Limited jobs (never used API)
router.get("/getLimitJobs/:limit", async(req, res)=>{
    let limitValue = (parseInt(req.params.limit))
    try{
       let result = await JobpostsModel.aggregate([{$limit:limitValue}])
       res.send(result)
    }catch(err){
        res.send("server error")
    }
})

router.get("/getTagsJobs/:name", async(req, res)=>{
    try{
        // let result = await JobpostsModel.aggregate([{$match:{Tags:req.params.name}}])
    let result = await JobpostsModel.find({Tags: {$elemMatch: {value: req.params.name,label: req.params.name }}})

        res.send(result)
    }catch(err){
        res.send("server error")
    }
})
// Archive CheckBox Jobs for admin
router.delete("/ArchiveCheckBoxArray/:ids", verifyToken, async(req, res)=>{
    let comingIds = req.params.ids.split(",")
    try{        

        let foundJobs=await JobpostsModel.find({_id:{$in:comingIds}})

        if (foundJobs.length > 0) {
            let archiveJobs=foundJobs.map((jobs)=>{
                return(
                    jobs
                )
            })
           let insertedValue= await Archived.insertMany({Archived:archiveJobs});
        let deletedJobs=await JobpostsModel.deleteMany({_id:{$in:comingIds}})
        }
res.send("success")
    }catch(err){
res.send("fail")
    }
})

router.get("/getArchiveJobs", async(req, res)=>{
    try{
        let result =await Archived.find({}, { Archived: 1, createdAt: 1})
        res.send(result)
    }catch(err){
        console.log("error")
        res.send("error")
    }
})
// delete CheckBox Jobs for admin
router.delete("/deleteCheckBoxArray/:ids", verifyToken, async(req, res)=>{
    let comingIds = req.params.ids.split(",") //2
    try{        
        let foundJobs=await JobpostsModel.find({_id:{$in:comingIds}})
        if (foundJobs.length > 0) {
            let archiveJobs=foundJobs.map((jobs)=>{
                return(
                    jobs
                )
            })
        let insertedValue= await Deleted.insertMany({Archived:archiveJobs});
        let deletedJobs=await JobpostsModel.deleteMany({_id:{$in:comingIds}})
        }
res.send("success")
    }catch(err){
res.send("fail")
    }
})

router.get("/getDeletedJobs", async(req, res)=>{
    try{
        let result =await Deleted.find({}, { Archived: 1, createdAt: 1})
        res.send(result)
    }catch(err){
        res.send("error")
    }
})

// ...............................Career JobsPost for Admin.......................

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

router.get("/getCareerjobs", verifyHomeJobs, async (req, res) => {
    try {
        let jobs = await CareerJobpostsModel.find().select()
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

module.exports = router