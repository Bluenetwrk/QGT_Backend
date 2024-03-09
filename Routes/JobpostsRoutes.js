const express = require("express")
const router = express.Router()
const JobpostsModel = require("../Schema/PostJobSchema")
const JobAppliedModel = require("../Schema/JobAppliedSchema")
const StudentProfileModel= require("../Schema/StudentProfileSchema")
var nodemailer = require('nodemailer');


const { MongoClient } = require("mongodb")
// const {getData} = require("../mongodb")
const {ObjectID} = require("mongodb")

router.post("/jobpost", async (req, res) => {
    try {
        const {Logo, empId, companyName, jobTitle, jobDescription, jobtype, salaryRange, jobLocation, qualification, experiance, skills } = (req.body)
        if ( !jobDescription || !companyName || !experiance || !jobLocation || !skills) {
            res.send("field are missing")
        } else {
            let jobs = new JobpostsModel(req.body)
            let result = await jobs.save()
            res.send("success")
        }
    } catch (error) {
        res.send("server issue ")
    }
})


// .................apply for jobs...............................
    //  Experiance:Experiance, age:age, jobSeekerId:jobSeekerId,jobId:jobId, Skills:Skills, Qualification:Qualification, NoticePeriod:NoticePeriod, ExpectedSalary: ExpectedSalary,  name:name, email:email, phoneNumber:phoneNumber, currentCTC: currentCTC

// router.post("/saveAppliedJob", async (req, res) => {
//     console.log(req.body)
 
//     const{_id, Experiance, age, Skills, Qualification, NoticePeriod, ExpectedSalary,  name, email, phoneNumber, currentCTC} = (req.body.userProfile)
//     const {jobId}=req.body
//     try {

//          let appliedJob = new JobAppliedModel({
//      Experiance:Experiance, age:age, jobSeekerId:_id,jobId:jobId, Skills:Skills, Qualification:Qualification, NoticePeriod:NoticePeriod, ExpectedSalary: ExpectedSalary,  name:name, email:email, phoneNumber:phoneNumber, currentCTC: currentCTC

//          })
//          let result = await appliedJob.save()
//          res.send(result)

 
//      }catch (err) {
//          res.status(401).send("server issue")
//          console.log(err)
//      }
//  })

// ............get all jobs for all......
router.get("/getjobs", async (req, res) => {
    try {
        let jobs = await JobpostsModel.find()
        res.send(jobs)

    } catch (err) {
        res.status(401).send("server issue")
    }
})
// .........getJobs for job details...........
router.get("/getjobs/:id", async (req, res) => {
    try {
        let jobs = await JobpostsModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})
// ................get jobs for myappliedjobs for jobseeker.......
router.get("/getMyAppliedjobs/:id", async (req, res) => {
    try {
        let jobs = await JobpostsModel.find({jobSeekerId: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})
// ................get my posted jobs for emplyee.......
router.get("/getPostedjobs/:id", async (req, res) => {
    try {
        let jobs = await JobpostsModel.find({ empId: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue", err)
    }
})
// .......... get jobs for update for emplyee........
router.get("/getJobForUpdate/:id", async (req, res) => {
    try {
        let jobs = await JobpostsModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send( err)
    }
})
// ..........update for emplyee job posts............
router.put("/updatPostedJob/:id", async (req, res) => {
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
router.delete("/deleteProduct/:id", async (req, res) => {
    let result = await JobpostsModel.deleteOne({ _id: req.params.id })
    if (result) {
        res.send(result)
    } else {
        res.send("error")
    }
})
// ...................job for apply ...............
// router.get("/findjob/:id", async (req, res) => {
//     try {
//         let jobs = await JobpostsModel.findOne({ _id: req.params.id })
//         res.send(jobs)
//     } catch (err) {
//         res.status(401).send("server issue", err)
//     }
// })

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
// ................... apply jobs for new collection called applied jobs saved onlyJob id and userID........
// router.post("/ApplyforJob", async (req, res) => {
//     try {
//         let user = new JobAppliedModel(req.body)
//         let result = await user.save()
                    
//         if (result) {
//             res.send({status:"success", result})
//         }         
//     } catch (err) {
//         res.send("back end error occured")
//     }
// })


// ..........update for job applyjobs for job seeker..................
router.put("/updatforJobApply/:id", async (req, res) => {
    let userId  = req.body.jobSeekerId

    try {
        let result = await JobpostsModel.updateOne(
           { _id: req.params.id},
           {$push: req.body}
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
                  user: 'parvaizmahroo1@gmail.com',
                  pass: 'qdmz vxlw ojcx fyoj'
                }
              });
              var mailOptions = {
                from: 'parvaizmahroo1@gmail.com',
                to: Usermail,
                subject: `Succesfully Applied for the Job ${JobTile}`,
                text: "you have applied for job successfully",
                html: `You have Succesfully Applied for the Job ${JobTile}`+'<p>Click <a href="http://www.itwalkin.com/Jobdetails/' + req.params.id + '"> here </a> to check the full details about the applied Job</p>'
                // context:paymentResult
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                //   res.send("could not send the mail")
                } else {
                //   console.log('Email sent: ' + info.response);
                  res.send(" mail sent succesfully")

                }
              });
            //   res.send(result)
        }
        }    

    } catch (err) {
        res.send("back end error occured")
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
//  get user id's for who has applied for job
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
    // console.log(req.params.id)
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





module.exports = router