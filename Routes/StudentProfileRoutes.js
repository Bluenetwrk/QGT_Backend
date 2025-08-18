const express = require("express");
const router = express.Router();
const StudentProfileModel = require("../Schema/StudentProfileSchema")
const QRscannermodel = require("../Schema/QRScannerSchema")
const DeletedJobSeeker = require("../Schema/deletedJobSeeker")
const ArchivedJobSeeker = require("../Schema/ArchivedJobSeeker")

const bcrypt = require("bcrypt")
const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const secretKey = "abcde";
var nodemailer = require('nodemailer');
// const importverifyToken = require('./JobpostsRoutes')
const Archived= require("../Schema/ArchiveJobsAchema")
const Deleted= require("../Schema/DeletedJobsSchema")
const fs = require('fs')
const mongoose = require("mongoose");

// Middleware
function verifyToken(req, res, next) {
    if (req.headers['authorization']) {
        let token = req.headers['authorization'].split(" ")[1]
        let id = req.headers['authorization'].split(" ")[0]
        if (token) {
            jwt.verify(token, secretKey, (err, valid) => {
                if (err) {
                    res.send("invalid token")
                } else {
                    let validid = valid.id
                    if (validid === id) {
                        next()
                    }
                }
            })
        } else {
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

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Images');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.put("/uploadImage/:id", upload.single('image'), async (req, res) => {
    imagePath = req.file.filename
    try {
const binary = Buffer.from(imagePath)
        let result = await StudentProfileModel.updateOne(
            { _id: req.params.id },
            // { $set: { image: `https://itwalkin-backend-testrelease-2-0-1-0824.onrender.com/Images/${imagePath}` } }
            // { $set: { image: `http://localhost:8080/Images/${imagePath}` } }
            { $set: { image: `https://itwalkin-backend-testrelease-2-0-1-0824-ns0g.onrender.com/Images/${imagePath}` } }
            //    { $set: { image: `https://i-twalkin-backend-testrelease-2-0-1-0824.vercel.app/Images/${imagePath}`}}
// { $set: { image: binary } }
      
        )

        if (result) {
            res.send(result)
        }
    } catch (err) {
        res.send("back error occured")
    }
})
router.post("/saveToken",verifyToken, async (req, res) => {
    try {
        let jobs = new StudentProfileModel(req.body)
        let result = await jobs.save()
        res.send("success")
    
} catch (error) {
    // console.log(error.message)
    res.send("server issue ")
}
})

// delete image for studentProfile....
router.put("/deleteImage/:id", async (req, res) => {
    const comingImagepath = req.body.image
    // const trimImagepath = comingImagepath.replace("https://itwalkin-backend-testrelease-2-0-1-0824.onrender.com/Images/", "")
    // const trimImagepath = comingImagepath.replace("http://localhost:8080/Images/", "")
    const trimImagepath = comingImagepath.replace("https://itwalkin-backend-testrelease-2-0-1-0824-ns0g.onrender.com/Images/", "")
    // const trimImagepath = comingImagepath.replace("https://i-twalkin-backend-testrelease-2-0-1-0824.vercel.app/Images/", "")
    const filepath = `public/Images/${trimImagepath}`
    try {
        let result = await StudentProfileModel.updateOne(
            { _id: req.params.id },
            { $unset: req.body },
            fs.unlinkSync(filepath, (err) => {
                if (err) {
                    //   console.error(`Error removing file: ${err}`);
                    return 0;
                } else {
                    return 1
                    // console.log("sucessss")
                }
            })
        )
        if (result) {
            res.send("success")
        }
    } catch (err) {
        res.send("back end error occured")

    }
})


const accountSid = 'ACbf18fad2a3317eaaee849f5c91b0bcee';
const authToken = '29a2b7a46349b15426eb0a58ff62df2c';
const client = require('twilio')(accountSid, authToken);

let OTP
let PhoneNumber

router.post("/otpSignUp", async (req, res) => {
    // console.log(req.body.PhoneNumber)
    PhoneNumber = req.body.PhoneNumber
    try {
        OTP = ""
        let digits = "0123456789"
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        client.messages
            .create({
                body: "your otp verification is " + OTP,
                from: '+13526786317',
                to: `+91${PhoneNumber}`
            })
        res.send("otp sent")
    } catch (err) {
        res.send("something went wrong")
    }
})
router.post("/verifyOtp", async (req, res) => {
    const { isApproved, ipAddress } = req.body
    let otp = req.body.otp
    try {
        if (otp !== OTP) {
            res.send("incorrect Otp")
        }
        let user = await StudentProfileModel.findOne({ phoneNumber: PhoneNumber })
        if (user == null) {
            let saveUser = await StudentProfileModel({ phoneNumber: PhoneNumber, isApproved: isApproved, ipAddress: ipAddress })
            let savedUser = await saveUser.save()
            if (savedUser) {
                let token = jwt.sign({ id: savedUser._id }, secretKey)
                res.send({ status: "success", token: token, id: savedUser._id })
            }
        } else {
            let token = jwt.sign({ id: user._id }, secretKey)
            res.send({ status: "success", token: token, id: user._id })
        }
    } catch (err) {
        res.send("backend issue")
    }
})
// .................Jobseeke Register ..............
router.post("/JobseekerRegister", async (req, res) => {
    // console.log(req.body)    
    try {
        let user = await new StudentProfileModel(req.body)
        let result = await user.save()
        if (result) {
            res.send("success")
        }
    } catch (err) {
        res.json(err.code)
    }
})

// .....initial login.............................
router.post("/Glogin", body('email').isEmail(), async (req, res) => {
    try {
        let { userId, gtoken, email, name, isApproved, ipAddress, Gpicture } = (req.body)
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.send("invalid email")
        }
        let user = await StudentProfileModel.findOne({ email: email });
        if (user == null) {
            const user = await new StudentProfileModel({ userId: userId, email: email, Gpicture: Gpicture, name: name, isApproved: isApproved, ipAddress: ipAddress })
            const result = await user.save(user)

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'bluenetwrk@gmail.com',
                    pass: 'vwzv axcq ywrw bxjd'
                }
            });
            var mailOptions = {
                from: 'bluenetwrk@gmail.com',
                to: result.email,
                subject: `Successfully Registered with Itwalkin`,
                html: '<p>Welcome to Itwalkin Job Portal</p>' + '<p>click <a href="http://www.itwalkin.com">itwalkin</a> to explore more </p>'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                } else {
                }
            });
            let gtoken = jwt.sign({ id: result._id }, secretKey)
            res.send({ status: "success", token: gtoken, id: result._id , action:"registered"})
        } else {
            let Nowtime = Date()  
            let result = await StudentProfileModel.updateOne(
                {_id: user._id},
               {$set: {LogedInTime:Nowtime, Gpicture: Gpicture}}
            )
            let gtoken = jwt.sign({ id: user._id }, secretKey)
            res.send({ status: "success", token: gtoken, id: user._id, action:"login" })
        }

    } catch (err) {
        res.send("backend error")
    }
})
// .........get userprofile to show in my profile and for update , my profile, admin check profile..........
router.get("/getProfile/:id", verifyToken, async (req, res) => {
    try {
        let result = await StudentProfileModel.findOne({ _id: req.params.id })
        if (result) {
            res.send({ status: "success", result })
        }

    } catch (err) {
        res.send("back end error occured")
    }
})

// login for Admin in search Params...

router.post("/loginforAdmin", body('email').isEmail(), async (req, res) => {
    try {
        let { email } = req.body
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.send("invalid email")
        }
        let user = await StudentProfileModel.findOne({ email: email })
        if (user == null) {
            res.send("user not registered")
        } else {
            // res.send(user)
            let token = jwt.sign({ id: user._id }, secretKey)
            res.send({ status: "success", id: user._id, token })
        }
    } catch (err) {
        res.send("back end error occured")
    }
})

// .....update full student profile...........
router.put("/updatProfile/:id", verifyToken, async (req, res) => {
    try {

        let result = await StudentProfileModel.updateOne(
            { _id: req.params.id },
            {
                $set: req.body
            })
        if (result) {
            res.send("success")
        }

    } catch (err) {
        res.send("back end error occured")
    }
})
// authentic for logout jobseeker
function CheckComp(req, res, next){
    let valid=req.headers['authorization']
    if(valid==='BlueItImpulseWalkinIn'){
        next()
}else{
    res.send("Unauthorised Access")
}
}


// ....get total number of Jobseekers for Admin and also for Emplyee search all condidiate..
router.get("/getAllJobseekers", CheckComp, async (req, res) => {
    try {
        let result = await StudentProfileModel.find()
        res.send(result)
    } catch (err) {
        res.send("backend error occured")
    }
})
//  getting student-profile with applied user id for Employee......
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

// delete jobseeker Admin API
router.delete("/deleteProfile/:id", async (req, res) => {
    try {
        let result = await StudentProfileModel.deleteOne({ _id: req.params.id })
        if (result) {
            res.send("success")
        }
    } catch (err) {
        res.send("backend issue")
    }
})
// update for approval from admin
router.put("/setApproval/:id", async (req, res) => {
    try {
        let result = await StudentProfileModel.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        )
        if (result) {
            res.send("success")
        }
    } catch (err) {
        res.send("backend error occured")
    }
})

// update for Reject from admin
router.put("/isReject/:id", async (req, res) => {
    try {
        let result = await StudentProfileModel.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        )
        if (result) {
            res.send("success")
        }
    } catch (err) {
        res.send("backend error occured")
    }
})

// isOnhold status from admin

router.put("/isOnhold/:id", async (req, res) => {
    try {
        let result = await StudentProfileModel.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        )
        if (result) {
            res.send("success")
        }
    } catch (err) {
        res.send("backend error occured")
    }
})

// find all Approved Jobseekers for admin
router.get("/getApprovedStu", async (req, res) => {
    try {
        let result = await StudentProfileModel.aggregate([{ $match: { isApproved: true } }])

        if (result) {
            res.send(result)
        }
    } catch (err) {
        res.send("backend Error Occured")
    }
})

// find all which are not Approved Jobseekers for admin
router.get("/getNotApprovedStu", async (req, res) => {
    try {
        let result = await StudentProfileModel.aggregate([{ $match: { isApproved: false } }])

        if (result) {
            res.send(result)
        }
    } catch (err) {
        res.send("backend Error Occured")
    }
})


var start = new Date();
start.setUTCHours(0, 0, 0, 0);

var end = new Date();
end.setUTCHours(23, 59, 59, 999);

let startDay = start.toUTCString()
let endDay = end.toUTCString()

router.get("/getTodayStuProfile", async (req, res) => {
    try {
        let result = await StudentProfileModel.find({ createdAt: { $gte: startDay, $lte: endDay } })
        if (result) {
            res.send(result)
        }
    } catch (err) {
        res.send("backend Error Occured")

    }
})

router.get("/getNoticePeriod", async (req, res) => {
    try {
        let result = await StudentProfileModel.find({ NoticePeriod: { $lte: "20 days" } })
        if (result) {
            res.send(result)
        }
    } catch (err) {
        res.send("backend Error Occured")

    }
})

// Search a job seeker for employer
router.get("/getJobSeeker/:SearchKey", async (req, res) => {
    try {
        let result = await StudentProfileModel.find(
            {
                "$or": [
                    { ExpectedSalary: { $regex: req.params.SearchKey } },
                    { Experiance: { $regex: req.params.SearchKey } },
                    { NoticePeriod: { $regex: req.params.SearchKey } },
                    { Qualification: { $regex: req.params.SearchKey } },
                    { Skills: { $regex: req.params.SearchKey } },
                    { age: { $regex: req.params.SearchKey } },
                    { currentCTC: { $regex: req.params.SearchKey } }
                ]
            })
        if (result) {
            res.send(result)
        } else {
            res.send("nothing found")
        }
    } catch (err) {
        res.send("backend error")
        console.log(err)
    }
})
// message sending from admin

router.put("/sendMessage/:id", async (req, res) => {
    try {
        let result = await StudentProfileModel.updateOne({
            _id: req.params.id
        },
            {
                $set: req.body
            })
        if (result) {
            res.send("success")
        }
    } catch (err) {
        res.send("some error occured")
    }
})

//  find all email only of jobseekers

router.get("/getAllemail", verifyToken, async (req, res) => {
    try {
        let result = await StudentProfileModel.find({}, { email: 1, _id: 0 })
        res.send(result)
    } catch (err) {
        res.send("serror error")
    }
})
//  get RecentLogin Employee foradmin
let today = new Date();
Date.prototype.subtractDays = function (d) {
    this.setTime(this.getTime() 
        - (d * 24 * 60 * 60 * 1000));
    return this;
    }
let a = new Date();
a.subtractDays(100);
router.get("/RecentLogin", verifyToken, async(req, res)=>{
    try{
        let result = await StudentProfileModel.find({ LogedInTime: {$gte:a , $lte:today} })
        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")
    }
})

// find all Online for admin
router.get("/checkOnline", verifyToken, async (req, res) => {
    try {
        // let result = await StudentProfileModel.aggregate([{ $match: { isApproved: false } }])
        let result = await StudentProfileModel.aggregate([{$match:{online:true}}])
        if (result) {
            res.send(result)
        }
    } catch (err) {
        res.send("backend Error Occured")
    }
})

router.get("/getSkillTags/:name", async(req, res)=>{

try{
    let result = await StudentProfileModel.find({Tags: {$elemMatch: {value: req.params.name,label: req.params.name }}
    })
       res.send(result)
    }catch(err){
        res.send("server error")
    }
})

// get  Job Seeker jobLocation  
router.get("/getStuLocation/:locationName", async(req, res)=>{
    try{
        let result = await StudentProfileModel.aggregate([{$match:{city:req.params.locationName}}])
        if(result){
            res.send(result)
        }
    }catch(err){
        res.send("backend error ")
    }
})

// ....delete JobSeeker Profile ....
router.delete("/deleteJobSeeker/:id", async (req, res) => {
    try{
    const Archived = await StudentProfileModel.findByIdAndDelete({ _id: req.params.id })
    const user = await new DeletedJobSeeker({Archived:Archived})
        const resu = await user.save()
        res.send("success")
    }catch(err){
        res.send("error")
    }
})
// archived Job seeker for admin
router.get("/getAllArchivedJobseekers", CheckComp,  async (req, res) => {
    try {
        let result = await DeletedJobSeeker.find({}, { Archived: 1, _id: 0,createdAt:1 })
        res.send(result)
    } catch (err) {
        res.send("backend error occured")
    }
})

// check archived full profile for admin

router.get("/getDeletedProfile/:id", verifyToken, async (req, res) => {

    try {
        let result = await DeletedJobSeeker
        .findOne(
            { "Archived._id": new mongoose.Types.ObjectId(req.params.id) }
          );
        if (result) {
            res.send( result )
        }
    } catch (err) {
        res.send("back end error occured")
console.log(err)

    }
})

router.get("/getArchivedProfile/:id", verifyToken, async (req, res) => {

    try {
        let result = await ArchivedJobSeeker.findOne(
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


router.get("/getTagsJobs/:name", async(req, res)=>{
    let comingParam=req.params.name
    let convertingArray=comingParam.split(",")
    // console.log(convertingArray)
    try{
        let result = await StudentProfileModel.aggregate([
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
        const profile = await StudentProfileModel.find({ _id: { $in: spliArray } })
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

//  pagination , get Limited jobs (never used API)
router.get("/getLimitJobs/:limit", verifyHomeJobs, async(req, res)=>{
    let limitValue = (parseInt(req.params.limit))
    let page = (parseInt(req.query.currentPage))
    // console.log(page)
    // console.log(limitValue)
    try{
       let result = await StudentProfileModel.find().sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
       res.send(result)
    }catch(err){
        res.send("server error")
    }
})

router.get("/getTotalCount", async(req, res)=>{
    try{
       let result =await StudentProfileModel.estimatedDocumentCount()
    //    console.log(result)
       res.status(200).send({"result":result})
    }catch(err){
       res.status(401).send({"result":"server issue"})
    }
})

router.delete("/ArchiveCheckBoxArray/:ids", verifyToken, async(req, res)=>{
    let comingIds = req.params.ids.split(",")
    try{        

        let foundJobs=await StudentProfileModel.find({_id:{$in:comingIds}})

        if (foundJobs.length > 0) {
            let archiveJobs=foundJobs.map((jobs)=>{
                return(
                    jobs
                )
            })
           let insertedValue= await ArchivedJobSeeker.insertMany({Archived:archiveJobs});
        let deletedJobs=await StudentProfileModel.deleteMany({_id:{$in:comingIds}})
        }
res.send("success")
    }catch(err){
res.send("fail")
    }
})

router.get("/getArchiveJobs", async(req, res)=>{
    try{
        let result =await ArchivedJobSeeker.find({}, { Archived: 1, createdAt: 1})
        res.send(result)
    }catch(err){
        console.log("error")
        res.send("error")
    }
})

router.get("/getTagsArchiveJobseekers/:name", async(req, res)=>{
    let comingParam=req.params.name
    let convertingArray=comingParam.split(",") // ["javascript", "react", "nodejs"]
    // console.log("686",convertingArray)
    try{
        const result = await ArchivedJobSeeker.aggregate([
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
        const profile = await ArchivedJobSeeker.aggregate([
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
       let result = await ArchivedJobSeeker.find({}, { Archived: 1, createdAt: 1})
       
       .sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
       res.send(result)
    }catch(err){
        res.send("server error")
    }
})

router.get("/getTotalCountArchiveJobseeker", async(req, res)=>{
    try{
    //    let result =await ArchivedJobSeeker.estimatedDocumentCount()
       let response = await ArchivedJobSeeker.aggregate([
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
    //  console.log(result)

       res.status(200).send({"result":result})
    }catch(err){
       res.status(401).send({"result":"server issue"})
       console.log(err)

    }
})

// ... for deleted for Jobseeker
router.get("/getTotalCountDeletedJobSeeker", async(req, res)=>{
    try{
    //    let result =await ArchivedJobSeeker.estimatedDocumentCount()
    let result =await DeletedJobSeeker.estimatedDocumentCount()
    //    console.log(result)
       res.status(200).send({"result":result})
    }catch(err){
       res.status(401).send({"result":"server issue"})
       console.log(err)

    }
})

//  pagination , get Limited jobs
router.get("/getLimitDeletedJobseeker/:limit", verifyHomeJobs, async(req, res)=>{
    let limitValue = (parseInt(req.params.limit))
    let page = (parseInt(req.query.currentPage))
    // console.log(limitValue)
    try{
       let result = await DeletedJobSeeker.find({}, { Archived: 1, createdAt: 1})
       
       .sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
    //    console.log(result)
       res.send(result)
    }catch(err){
        res.send("server error")
    }
})


router.get("/getTagsDeletedJobSeeker/:name", async(req, res)=>{
    let comingParam=req.params.name
    let convertingArray=comingParam.split(",") // ["javascript", "react", "nodejs"]
    // console.log("686",convertingArray)
    try{
        const result = await DeletedJobSeeker.aggregate([
            {$match:{"Archived.Tags":{$in:convertingArray}}},
            { $project: { _id: 1, "Archived._id": 1, createdAt: 1 } }
          ]);
// console.log("816",result);
    res.send(result) // only id's will be shared
    }catch(err){
        res.send("server error")
        console.log(err)
    }
})


router.get("/DeletedJobSeekerTagsIds/:id", async (req, res) => {
    let limitValue = (parseInt(req.query.recordsPerPage))
    let page = (parseInt(req.query.currentPage))
    // console.log(limitValue)
    let comingArray = req.params.id
    let spliArray = comingArray.split(",")
    // console.log(spliArray)
    let arr=[ "67b5f59ed660de1cc80b6132", "67b60458d660de1cc80b6152" ]
    
    try {   
        const objectIds = spliArray.map(id => new mongoose.Types.ObjectId(id));
        const profile = await DeletedJobSeeker.aggregate([
            { $unwind: "$Archived" }, // Flatten the Archived array
            { $match: { "Archived._id": { $in: objectIds } } }, // Match the IDs inside Archived
        ])   
        .sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
        if (profile) {
            res.send(profile)
    // console.log("843",profile)

        } else {
            res.send("not found")
        }

    } catch (err) {
        res.send("server error occured")
        console.log(err)
    }
})


module.exports = router



// ................Google Auth setup......bcrypt
// router.get("/login/failed", (req, res) => {
//     res.status(401).json({
//         err: true,
//         message: "log in failure",
//     });
// });

// router.get("/auth/google",
//     passport.authenticate("google", { scope: ['openid', 'profile', 'email'] },
//             https:www.googleapis.com/auth/plus.login
//     ));

// router.get("/auth/google/callback",
//     passport.authenticate("google", {

//         successRedirect: "/login/success",
//         failureRedirect: "/login/failed"
//     }),
//     function (req, res) {
//         res.redirect("login/success");
//     }
// );
// router.get("/login/success", (eq, res) => {
//     if (req.user) {
//         res.status(200).json({ status: "login success", user: req.user })
//     }
// })

// router.get("/logout", (req, res) => {
//     req.logout();
//     res.redirect(process.env.CLIENT_URL);
// });
// .................................users.....for Register.....................................

// router.post("/Register", body('email').isEmail(), async (req, res) => {

//     let { name, email, password, confirmPassword } = (req.body)
//     if (!name || !email || !password || !confirmPassword) {
//         res.send("fields are missing")
//     }
//     const error = validationResult(req)
//     if (!error.isEmpty()) {
//         return res.send("invalid email")
//     }
//     else if (password !== confirmPassword) {
//         res.send("password and confirm password are not matching")
//     }
//     let pass = password.toString()
//     let salt = await bcrypt.genSalt(10)
//     let hashPassword = await bcrypt.hash(pass, salt);
//     password = hashPassword
//     console.log("pass", password)
//     try {
//         const user = new userModel({ name, email, password })
//         const result = await user.save()
//         let token = jwt.sign({ id: user._id }, secretKey)
//         return res.json({ result: "success", token })
//     } catch (err) {
//         res.json(err)
//     }
// })

// router.post("/GmailRegister", async (req, res) => {
//     let { gemail, gname } = (req.body)
//     try {
//         const user = await new userModel({ email: gemail, name: gname })

//         const result = await user.save(user)
//         console.log(result)
//         res.send({ status: "result is ", result })
//     } catch (err) {
//         res.send(err)
//     }
// })


// ................................Login with password.........................

// router.post("/login", async (req, res) => {
//         const { email, password } = (req.body)
//         if (!email || !password) {
//             res.send("fileds are missing")
//         }
//         try {
//             const user = await userModel.findOne({ email: email });
//             if (user == null) {
//                 res.send("no user found")
//             } else {
//                 const hashedpassword = user.password
//                 let pass = password.toString()

//                 let result = bcrypt.compareSync(pass, hashedpassword)

//                 if (result == true) {

//                     let token = jwt.sign({ id: user._id }, secretKey)

//                     return res.json({ result: "success", id: user._id, token })
//                 } else {
//                     res.send("incorrect password")
//                 }
//             }
//         }
//         catch (err) {
//             res.send(err)
//         }
//     })

