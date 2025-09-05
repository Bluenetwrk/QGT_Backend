const express = require("express")
const router = express.Router()
const JobpostsModel = require("../Schema/PostJobSchema")
// const CareerJobpostsModel = require("../Schema/CareerJobSchema")
// const JobAppliedModel = require("../Schema/JobAppliedSchema")
const walkinpostsModel = require("../Schema/PostWalkinSchema")
// const CareerJobpostsModel = require("../Schema/CareerJobSchema")
const WalkinAppliedModel = require("../Schema/WalkinAppliedschema")
const StudentProfileModel= require("../Schema/StudentProfileSchema")
const Archived= require("../Schema/ArchievedWalkinSchema")
const Deleted= require("../Schema/DeletedWalkinSchema")
var nodemailer = require('nodemailer');
const mongoose = require("mongoose");

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

// function verifyHomeJobs(req, res, next){
//     let valid=req.headers['authorization']
//     if(valid==='BlueItImpulseWalkinIn'){
//         next()
// }else{
//     res.send("Unauthorised Access")
// }
// }

// employee job postings

// ............get all jobs for all......
router.get("/getwalkins", verifyToken, async (req, res) => {
    try {
        let jobs = await walkinpostsModel.find()
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
router.get("/getHomewalkins", verifyHomeJobs, async (req, res) => {
    try {
        let jobs = await walkinpostsModel.find().select()
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})
//......get all active walkins......
router.get("/allactivewalkins", verifyHomeJobs, 
    async (req,res) => {
    try { 
        const currentDate = new Date();
        let jobs = await walkinpostsModel.find({driveDate: {$gte : currentDate}})
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
    })
// ............get all H jobs for all posted by admin for admin my posted jobs......
router.get("/getAdminwalkins", verifyHomeJobs, async (req, res) => {
    try {
        let result = await walkinpostsModel.aggregate([{ $match: { Adminpost: true } }])
        res.send(result)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// employee job postings

router.post("/walkinpost", verifyToken, async (req, res) => {
    try {
        const {Logo, empId, companyName, jobTitle, jobDescription, jobtype, profileData,adminLogin,Tags,selectedDate,successMessage,Adminpost,comment,
            salaryRange, jobLocation, qualification, experiance, skills, driveDate, venue, StartTime,EndTime,jobSeekerId,WaitingArea,tokenNo,createdDateTime,updatedDateTime,HRCabin,InterviewCompleted,time,concent,driveId,QRCodeDetection,HRId } = (req.body)
        if ( !jobDescription || !companyName || !experiance || !jobLocation ||!driveDate || !venue) {
            res.send("fields are missing")
        } else {
            let jobs = new walkinpostsModel(req.body)
            let result = await jobs.save()
            res.send("success")
        }
    } catch (error) {
        // console.log(error.message)
        res.send("server issue ")
    }
})
router.put("/saveToken",verifyToken, async (req, res) => {
    try {
        let jobs = new walkinpostsModel(req.body)
        let result = await jobs.save()
        res.send("success")
    
} catch (error) {
    // console.log(error.message)
    res.send("server issue ")
}
})
// ............get all Home jobs for all......
// router.get("/getHomewalkins", verifyHomeJobs, async (req, res) => {
//     try {
//         let jobs = await walkinpostsModel.find().select()
//         res.send(jobs)
//     } catch (err) {
//         res.status(401).send("server issue")
//     }
// })
// ............get all H jobs for all posted by admin for admin my posted jobs......
// router.get("/getAdminwalkins", verifyHomeJobs, async (req, res) => {
//     try {
//         let result = await walkinpostsModel.aggregate([{ $match: { Adminpost: true } }])
//         res.send(result)
//     } catch (err) {
//         res.status(401).send("server issue")
//     }
// })

// .........getJobs for job details...........
router.get("/walkindetails/:id",verifyHomeJobs, async (req, res) => {
    try {
        let jobs = await walkinpostsModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// ................get my posted jobs for emplyee.......
router.get("/getPostedwalkins/:id", verifyToken, async (req, res) => {
    try {
        let jobs = await walkinpostsModel.find({ empId: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue", err)
    }
})
// .......... get jobs for update for emplyee........
router.get("/getwalkinForUpdate/:id",verifyHomeJobs, async (req, res) => {
    try {
        let jobs = await walkinpostsModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send( err)
    }
})
// ..........update for emplyee job posts............
router.put("/updatPostedwalkin/:id", verifyHomeJobs, async (req, res) => {
    try {
      const { jobSeekerId, WaitingArea, HRCabin,InterviewCompleted,QRCodeDetection, ...rest } = req.body;
  
      // Build update payload dynamically
      const updatePayload = {};
  
      // Only add non-empty arrays or objects
      if (jobSeekerId && Object.keys(jobSeekerId).length > 0) {
        updatePayload.$addToSet = updatePayload.$addToSet || {};
        updatePayload.$addToSet.jobSeekerId = jobSeekerId;
      }
  
      if (WaitingArea && Object.keys(WaitingArea).length > 0) {
        updatePayload.$addToSet = updatePayload.$addToSet || {};
        updatePayload.$addToSet.WaitingArea = WaitingArea;
      }
  
      if (HRCabin && Object.keys(HRCabin).length > 0) {
        updatePayload.$addToSet = updatePayload.$addToSet || {};
        updatePayload.$addToSet.HRCabin = HRCabin;
      }
      if (InterviewCompleted && Object.keys(InterviewCompleted).length > 0) {
        updatePayload.$addToSet = updatePayload.$addToSet || {};
        updatePayload.$addToSet.InterviewCompleted = InterviewCompleted;
      }
      if (QRCodeDetection && Object.keys(QRCodeDetection).length > 0) {
        updatePayload.$addToSet = updatePayload.$addToSet || {};
        updatePayload.$addToSet.QRCodeDetection = QRCodeDetection;
      }

  
      // Add scalar updates
      if (Object.keys(rest).length > 0) {
        updatePayload.$set = rest;
      }
  
      const result = await walkinpostsModel.updateOne(
        { _id: req.params.id },
        updatePayload
      );
  
      res.send(result.modifiedCount > 0 ? "success" : "no changes made");
    } catch (err) {
      res.status(500).send("backend error occurred");
    }
  });
  
// ...........delete posted job for employee..............
router.delete("/deletewalkin/:id", async (req, res) => {
    let result = await walkinpostsModel.deleteOne({ _id: req.params.id })
    if (result) {
        res.send(result)
    } else {
        res.send("error")
    }
})

// .............Search.................
router.get("/searchwalkin/:key", async(req,res)=>{
    try{
    let result = await walkinpostsModel.find({
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
router.put("/updatforwalkinApply/:id", verifyToken, async (req, res) => {
    let userId  = req.body.jobSeekerId
    try {
        let result = await walkinpostsModel.updateOne(
           { _id: req.params.id},
           {$push: {jobSeekerId:req.body}}
         )
         let job = await walkinpostsModel.findOne({_id:req.params.id})
         let JobTitle = job.jobTitle
        if (result) {
        let user =  await StudentProfileModel.findOne({ _id:userId})
        let Usermail  =user.email
        if(Usermail){        
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
       user: 'admin@itwalkin.com',
      pass: 'hvzd mjnq yfxa eljs'
                }
              });
              var mailOptions = {
                from: 'admin@itwalkin.com',
                to: Usermail,
                subject: `Succesfully Registered for the Walkin ${JobTitle}`,
                text: "you have registered for walkin successfully",
                html: `You have Succesfully Registered for the Walkin ${JobTitle}`+'<p>Click <a href="https://www.itwalkin.in/walkindetails/' + btoa(req.params.id) + '"> here </a> to check the full details about the registered walkin</p>'
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
router.get("/getMyAppliedwalkin/:id", async (req, res) => {
    try {
        // let jobs = await JobpostsModel.find({jobSeekerId: req.params.id })
    let jobs = await walkinpostsModel.find({jobSeekerId: {$elemMatch: {jobSeekerId: req.params.id }}})

        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})


// .......Undo Select , Reject, OnHold.............

router.put("/updatforUndoWalkinApplied/:id", async (req, res) => {
    try {
        let result = await walkinpostsModel.updateOne(           
            {_id: req.params.id}, 
            {$pull:req.body}  )
        if (result) {
            res.send("success")
        }                     
    } catch (err) {
        res.send("back end error occured")
    }
})
// .......upate for undoJobApply..or delete Job Applied...........

router.put("/DeleteWalkinApplied/:id", async (req, res) => {
    try {
        let result = await walkinpostsModel.updateOne(           
            {_id: req.params.id}, 
            {$pull:{jobSeekerId:req.body}}  )
            if(result.matchedCount===0){
                let careerResult = await CareerJobpostsModel.updateOne(           
                    {_id: req.params.id}, 
                    {$pull:{jobSeekerId:req.body}} )
                 if (careerResult) {
                    res.send("success")
                }
            }else{            
                    res.send("success")
                }
                                        
    } catch (err) {
        res.send("back end error occured")
    }
})
//  get user id's for who has applied for job from a single job
router.get("/getAppliedUserIds/:id", async(req,res)=>{
    try{
        let JobIds= await walkinpostsModel.findOne({_id:req.params.id})
        if(JobIds){
            res.send(JobIds)
        }else{
            res.send("not found")
        }
    }catch(err){
        res.send("server error occured")
    }
})
router.get("/getAppliedProfileByIds/:id", async (req, res) => {
    let comingArray = req.params.id
    let spliArray = comingArray.split(",")

    try {
        // console.log("local value",['6533629f105bb11463d44bb4', '652f76a8eff06fe23539e03d','652f73966749e34e868567e1'])
        const profile = await StudentProfileModel.find({ _id: { $in: spliArray } })
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
// .select , reject, onhold..............
router.put("/status/:id", async(req, res)=>{
    try{
        let result= await walkinpostsModel.updateOne(
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
//   ..... delete  all field of job description.....
router.put("/deleteDescription", async(req, res)=>{
    try{
        let result= await walkinpostsModel.
        updateMany(
            {},
            { $unset: { "jobDescription": "" } }
         
        )
        if(result){
            res.send("success")
                }        
    }catch(err){
        res.send("back error occured")
    }

})

// ....delete job for admin....
// router.delete("/deleteWalkin/:id", async (req, res) => {
//     let result = await walkinpostsModel.deleteOne({ _id: req.params.id })
//     if (result) {
//         res.send(result)
//     } else {
//         res.send("error")
//     }
// })

// today Posted Jobs
var start = new Date();  
start.setUTCHours(0,0,0,0);

var end = new Date();
end.setUTCHours(23,59,59,999);

let startDay =start.toUTCString() 
let endDay=end.toUTCString()

router.get("/getTodayPostedWalkin", async(req, res)=>{ 
    try{
        let result = await walkinpostsModel.find({ createdAt: {$gte: startDay, $lte:endDay} })
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
        let result = await walkinpostsModel.find({"$or":[{jobTitle:{$regex:req.params.id}}]})
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
        let result = await walkinpostsModel.find({"$or":[{jobLocation:{$regex:req.params.id}}]})
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
            let both=   await walkinpostsModel.find({$and: [{jobLocation: {$regex:req.params.id}},{jobTitle: {$regex:req.body.jobTitle}}]})
        if(both){
            res.send(both)
        }
           }             
    }catch(err){
        res.send("backend error ")
        // console.log(err)
    }
})



//  pagination , get Limited jobs
router.get("/getLimitWalkins/:limit", verifyHomeJobs, async(req, res)=>{
    let limitValue = (parseInt(req.params.limit))
    let page = (parseInt(req.query.currentPage))
    // console.log(page)
    // console.log(limitValue)
    try{
        const currentDate = new Date();
       let result = await walkinpostsModel.find({driveDate: {$gte : currentDate}}).sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
       res.send(result)
    }catch(err){
        res.send("server error")
    }
})

router.get("/getTotalCount", async(req, res)=>{
    try{
        const currentDate = new Date();
        const result = await walkinpostsModel.countDocuments({ driveDate: { $gte: currentDate } });
    //    console.log(result)
       res.status(200).send({"result":result})
    }catch(err){
       res.status(401).send({"result":"server issue"})
    }
})
//  get job by Tag filter
router.get("/getTagsWalkins/:name", async(req, res)=>{
    let comingParam=req.params.name
    let convertingArray=comingParam.split(",") // ["javascript", "react", "nodejs"]
    // console.log(convertingArray)
    try{
        let result = await walkinpostsModel.aggregate([
            {$match:{Tags:{$in:convertingArray}}},
            { $project: { _id: 1, createdAt: 1 } }
        ])
    // console.log("dcdskjcc",result) // will get id's only
    res.send(result)
    }catch(err){
        res.send("server error")
        console.log(err)
    }
})

router.get("/walkinTagsIds/:id", async (req, res) => {
    let limitValue = (parseInt(req.query.recordsPerPage))
    let page = (parseInt(req.query.currentPage))
    // console.log(page)
    // console.log(limitValue)
    let comingArray = req.params.id
    let spliArray = comingArray.split(",")

    try {
        // console.log("local value",['6533629f105bb11463d44bb4', '652f76a8eff06fe23539e03d','652f73966749e34e868567e1'])
        const profile = await walkinpostsModel.find({ _id: { $in: spliArray } })
        .sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
        if (profile) {
            res.send(profile)
    // console.log(profile)

        } else {
            res.send("not found")
        }

    } catch (err) {
        res.send("server error occured")
        console.log(err)
    }
})




// Archive CheckBox Jobs for admin
router.delete("/ArchiveCheckBoxArray/:ids", verifyToken, async(req, res)=>{
    let comingIds = req.params.ids.split(",")
    try{        

        let foundJobs=await walkinpostsModel.find({_id:{$in:comingIds}})

        if (foundJobs.length > 0) {
            let archiveWalkins=foundJobs.map((jobs)=>{
                return(
                    jobs
                )
            })
           let insertedValue= await Archived.insertMany({Archived:archiveWalkins});
        let deletedWalkins=await walkinpostsModel.deleteMany({_id:{$in:comingIds}})
        }
res.send("success")
    }catch(err){
res.send("fail")
    }
})

router.get("/getArchiveWalkins", async(req, res)=>{
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
        let foundJobs=await walkinpostsModel.find({_id:{$in:comingIds}})
        if (foundJobs.length > 0) {
            let archiveWalkins=foundJobs.map((jobs)=>{
                return(
                    jobs
                )
            })
        let insertedValue= await Deleted.insertMany({Archived:archiveWalkins});
        let deletedWalkins=await walkinpostsModel.deleteMany({_id:{$in:comingIds}})
        }
res.send("success")
    }catch(err){
res.send("fail")
    }
})

router.get("/getDeletedWalkins", async(req, res)=>{
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

//for Archive jobs

router.get("/getTagsArchiveJobseekers/:name", async(req, res)=>{
    let comingParam=req.params.name
    let convertingArray=comingParam.split(",") // ["javascript", "react", "nodejs"]
    // console.log("686",convertingArray)
    try{
        const result = await Archived.aggregate([
            { $unwind: "$Archived" },
            {$match:{"Archived.Tags":{$in:convertingArray}}},
            { $project: { _id: 1, "Archived._id": 1, createdAt: 1 } }
          ]);
// console.log(result);
    res.send(result) // only id's will be shared
    }catch(err){
        res.send("server error")
        console.log(err)
    }
})


router.get("/ArchiveJobseekerTagsIds/:id", async (req, res) => {
    let limitValue = (parseInt(req.query.recordsPerPage))
    let page = (parseInt(req.query.currentPage))
    // console.log(limitValue)
    let comingArray = req.params.id
    let spliArray = comingArray.split(",")
    // console.log(spliArray)
    let arr=[ "67b5f59ed660de1cc80b6132", "67b60458d660de1cc80b6152" ]
    
    try {   
        const objectIds = spliArray.map(id => new mongoose.Types.ObjectId(id));
        const profile = await Archived.aggregate([
            { $unwind: "$Archived" }, // Flatten the Archived array
            { $match: { "Archived._id": { $in: objectIds } } }, // Match the IDs inside Archived
        ])   
        .sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
        if (profile) {
            res.send(profile)
    // console.log(profile)

        } else {
            res.send("not found")
        }

    } catch (err) {
        res.send("server error occured")
        console.log(err)
    }
})

//  pagination , get Limited jobs
router.get("/getLimitArchiveJobseeker/:limit", verifyHomeJobs, async(req, res)=>{
    let limitValue = (parseInt(req.params.limit))
    let page = (parseInt(req.query.currentPage))
    // console.log(page)
    // console.log(limitValue)
    try{
       let result = await Archived.find({}, { Archived: 1, createdAt: 1})
       
       .sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
       res.send(result)
    //    console.log(result)
    }catch(err){
        res.send("server error")
    }
})

router.get("/getTotalCountArchiveJobseeker", async(req, res)=>{
    try{
    //    let result =await Archived.estimatedDocumentCount()
       let response = await Archived.aggregate([
        {
          $group: {
            _id: null,
            totalArchivedLength: { $sum: { $size: "$Archived" } }
          }
        }
      ])
      let result
     response.map((item)=>{
        return(
            result= item.totalArchivedLength
        )
     })

       res.status(200).send({"result":result})
    }catch(err){
       res.status(401).send({"result":"server issue"})
       console.log(err)

    }
})

//get single Archive Jobs

router.get("/getArchivedProfile/:id",  async (req, res) => {
// console.log(req.params.id)
    try {
        let result = await Archived.findOne(
            { "Archived._id": new mongoose.Types.ObjectId(req.params.id) },
            { "Archived.$": 1 }
          );
        if (result) {
            res.send( result )
        }
        // console.log(result)
    } catch (err) {
        res.send("back end error occured")
console.log(err)

    }
})

//for Deleted jobs

router.get("/getTagsDeletedJobseekers/:name", async(req, res)=>{
    let comingParam=req.params.name
    let convertingArray=comingParam.split(",") // ["javascript", "react", "nodejs"]
    // console.log("686",convertingArray)
    try{
        const result = await Deleted.aggregate([
            { $unwind: "$Archived" },
            {$match:{"Archived.Tags":{$in:convertingArray}}},
            { $project: { _id: 1, "Archived._id": 1, createdAt: 1 } }
          ]);
// console.log(result);
    res.send(result) // only id's will be shared
    }catch(err){
        res.send("server error")
        console.log(err)
    }
})


router.get("/DeletedJobseekerTagsIds/:id", async (req, res) => {
    let limitValue = (parseInt(req.query.recordsPerPage))
    let page = (parseInt(req.query.currentPage))
    // console.log(limitValue)
    let comingArray = req.params.id
    let spliArray = comingArray.split(",")
    // console.log(spliArray)
    let arr=[ "67b5f59ed660de1cc80b6132", "67b60458d660de1cc80b6152" ]
    
    try {   
        const objectIds = spliArray.map(id => new mongoose.Types.ObjectId(id));
        const profile = await Deleted.aggregate([
            { $unwind: "$Archived" }, // Flatten the Archived array
            { $match: { "Archived._id": { $in: objectIds } } }, // Match the IDs inside Archived
        ])   
        .sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
        if (profile) {
            res.send(profile)
    // console.log(profile)

        } else {
            res.send("not found")
        }

    } catch (err) {
        res.send("server error occured")
        console.log(err)
    }
})

//  pagination , get Limited jobs
router.get("/getLimitDeletedJobseeker/:limit", verifyHomeJobs, async(req, res)=>{
    let limitValue = (parseInt(req.params.limit))
    let page = (parseInt(req.query.currentPage))
    // console.log(page)
    // console.log(limitValue)
    try{
       let result = await Deleted.find({}, { Archived: 1, createdAt: 1})
       
       .sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
       res.send(result)
    }catch(err){
        res.send("server error")
    }
})

router.get("/getTotalCountDeletedJobseeker", async(req, res)=>{
    try{
    //    let result =await Archived.estimatedDocumentCount()
       let response = await Deleted.aggregate([
        {
          $group: {
            _id: null,
            totalArchivedLength: { $sum: { $size: "$Archived" } }
          }
        }
      ])
      let result
     response.map((item)=>{
        return(
            result= item.totalArchivedLength
        )
     })

       res.status(200).send({"result":result})
    }catch(err){
       res.status(401).send({"result":"server issue"})
       console.log(err)

    }
})

//get single Archive Jobs

router.get("/getDeletedProfile/:id",  async (req, res) => {
    // console.log(req.params.id)
        try {
            let result = await Deleted.findOne(
                { "Archived._id": new mongoose.Types.ObjectId(req.params.id) },
                { "Archived.$": 1 }
              );
            if (result) {
                res.send( result )
            }
            // console.log(result)
        } catch (err) {
            res.send("back end error occured")
    console.log(err)
    
        }
    })

    router.delete("/deleteArchivedWalkins/:ids", async (req, res) => {
        // console.log("called")
        try {
    // let comingIds = req.params.ids.split(",") //2
    let comingId = req.params.ids.split(",") //2
    let comingIds = comingId.map(id => new mongoose.Types.ObjectId(id));
// console.log(comingIds)
          const result = await Archived.updateMany(
            { "Archived._id": { $in: comingIds } }, // Find any document where Archived contains these IDs
            { $pull: { Archived: { _id: { $in: comingIds } } } } // Remove matching objects from Archived
          );
          const tabledeleted = await Archived.deleteMany({ Archived: { $size: 0 } });
      
          res.status(200).json({ message: "Archived items deleted successfully", result });
        } catch (error) {
          res.status(500).json({ error: "Error deleting archived items" });
        }
      });

      router.delete("/deleteDeletedWalkins/:ids", async (req, res) => {
        // console.log("called")
        try {
    // let comingIds = req.params.ids.split(",") //2
    let comingId = req.params.ids.split(",") //2
    let comingIds = comingId.map(id => new mongoose.Types.ObjectId(id));
// console.log(comingIds)
          const result = await Deleted.updateMany(
            { "Archived._id": { $in: comingIds } }, // Find any document where Archived contains these IDs
            { $pull: { Archived: { _id: { $in: comingIds } } } } // Remove matching objects from Archived
          );
          const tabledeleted = await Deleted.deleteMany({ Archived: { $size: 0 } });
          res.status(200).json({ message: "Archived items deleted successfully", result });
        } catch (error) {
          res.status(500).json({ error: "Error deleting archived items" });
        }
      });
            
    
module.exports = router