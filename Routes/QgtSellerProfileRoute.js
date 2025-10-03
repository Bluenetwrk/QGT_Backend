const express = require("express")
const router = express.Router()
const sellerprofileModel = require("../Schema/QgtSellerProfileSchema")

const bcrypt = require("bcrypt")
const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const secretKey = "Swami"
var nodemailer = require('nodemailer')
const fs = require('fs')
const mongoose = require("mongoose")
const buyerprofileModel = require("../Schema/QgtBuyerProfileSchema")

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

function verifyHomeQuotes(req, res, next){
    let valid=req.headers['authorization']
    if(valid==='BlueItImpulseWalkinIn'){
        next()
}else{
    res.send("Unauthorised Access")
}
}

// .................Seller Register ..............
router.post("/SellerRegister", async (req, res) => {
    // console.log(req.body)    
    try {
        let user = await new sellerprofileModel(req.body)
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
        let user = await // .....initial login.............................
router.post("/Glogin", body('email').isEmail(), async (req, res) => {
    try {
        let { userId, gtoken, email, name, isApproved, ipAddress, Gpicture } = (req.body)
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.send("invalid email")
        }
        let user = await sellerprofileModel.findOne({ email: email });
        if (user == null) {
            const user = await new sellerprofileModel({ userId: userId, email: email, Gpicture: Gpicture, name: name, isApproved: isApproved, ipAddress: ipAddress })
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
                subject: `Successfully Registered with QuoteGenerator`,
                html: '<p>Welcome to QuoteGenerator</p>' + '<p>click <a href="http://www.getquote.shop">QuoteGenerator</a> to explore more </p>'
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
            let result = await sellerprofileModel.updateOne(
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
        let result = await sellerprofileModel.findOne({ _id: req.params.id })
        if (result) {
            res.send({ status: "success", result })
        }

    } catch (err) {
        res.send("back end error occured")
    }
})
.findOne({ email: email });
        if (user == null) {
            const user = await new sellerprofileModel({ userId: userId, email: email, Gpicture: Gpicture, name: name, isApproved: isApproved, ipAddress: ipAddress })
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
                subject: `Successfully Registered with QuoteGenerator`,
                html: '<p>Welcome to QuoteGenerator</p>' + '<p>click <a href="http://www.getquote.shop">QuoteGenerator</a> to explore more </p>'
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
            let result = await sellerprofileModel.updateOne(
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
        let result = await sellerprofileModel.findOne({ _id: req.params.id })
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
        let user = await // login for Admin in search Params...

router.post("/loginforAdmin", body('email').isEmail(), async (req, res) => {
    try {
        let { email } = req.body
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.send("invalid email")
        }
        let user = await sellerprofileModel.findOne({ email: email })
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
}).findOne({ email: email })
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

// .....update full seller profile...........
router.put("/updateProfile/:id", verifyToken, async (req, res) => {
    try {

        let result = await sellerprofileModel.updateOne(
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
router.get("/getAllBuyers", CheckComp, async (req, res) => {
    try {
        let result = await buyerprofileModel.find()
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
        const profile = await sellerprofileModel.find({ _id: { $in: spliArray } })
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
        let result = await sellerprofileModel.deleteOne(
            { _id: req.params.id },
            { $set: req.body }
        )
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
        let result = await sellerprofileModel.updateOne(
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
        let result = await sellerprofileModel.updateOne(
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
        let result = await sellerprofileModel.updateOne(
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
router.get("/getApprovedSeller", async (req, res) => {
    try {
        let result = await sellerprofileModel.aggregate([{ $match: { isApproved: true } }])

        if (result) {
            res.send(result)
        }
    } catch (err) {
        res.send("backend Error Occured")
    }
})

// find all which are not Approved Jobseekers for admin
router.get("/getNotApprovedSeller", async (req, res) => {
    try {
        let result = await sellerprofileModel.aggregate([{ $match: { isApproved: false } }])

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

router.get("/getTodaySellerProfile", async (req, res) => {
    try {
        let result = await sellerprofileModel.find({ createdAt: { $gte: startDay, $lte: endDay } })
        if (result) {
            res.send(result)
        }
    } catch (err) {
        res.send("backend Error Occured")

    }
})

// Search a job seeker for employer
router.get("/getSeller/:SearchKey", async (req, res) => {
    try {
        let result = await sellerprofileModel.find(
            {
                "$or": [
                    { Item: { $regex: req.params.SearchKey } }
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
        let result = await sellerprofileModel.updateOne({
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
        let result = await sellerprofileModel.find({}, { email: 1, _id: 0 })
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
        let result = await sellerprofileModel.find({ LogedInTime: {$gte:a , $lte:today} })
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
        let result = await sellerprofileModel.aggregate([{$match:{online:true}}])
        if (result) {
            res.send(result)
        }
    } catch (err) {
        res.send("backend Error Occured")
    }
})

router.get("/getItemTags/:name", async(req, res)=>{

try{
    let result = await sellerprofileModel.find({Tags: {$elemMatch: {value: req.params.name,label: req.params.name }}
    })
       res.send(result)
    }catch(err){
        res.send("server error")
    }
})

// get  Job Seeker jobLocation  
router.get("/getSellerLocation/:locationName", async(req, res)=>{
    try{
        let result = await sellerprofileModel.aggregate([{$match:{city:req.params.locationName}}])
        if(result){
            res.send(result)
        }
    }catch(err){
        res.send("backend error ")
    }
})

// ....delete JobSeeker Profile ....
router.delete("/deleteSeller/:id", async (req, res) => {
    try{
    const Archived = await sellerprofileModel.findByIdAndDelete({ _id: req.params.id })
    const user = await new DeletedSeller({Archived:Archived})
        const resu = await user.save()
        res.send("success")
    }catch(err){
        res.send("error")
    }
})

router.get("/getTagsItem/:name", async(req, res)=>{
    let comingParam=req.params.name
    let convertingArray=comingParam.split(",")
    // console.log(convertingArray)
    try{
        let result = await sellerprofileModel.aggregate([
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

router.get("/ItemTagsIds/:id", async (req, res) => {
    let limitValue = (parseInt(req.query.recordsPerPage))
    let page = (parseInt(req.query.currentPage))
    // console.log(page)
    // console.log(limitValue)
    let comingArray = req.params.id
    let spliArray = comingArray.split(",")

    try {
        // console.log("local value",['6533629f105bb11463d44bb4', '652f76a8eff06fe23539e03d','652f73966749e34e868567e1'])
        const profile = await sellerprofileModel.find({ _id: { $in: spliArray } })
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
router.get("/getLimitItems/:limit", verifyHomeQuotes, async(req, res)=>{
    let limitValue = (parseInt(req.params.limit))
    let page = (parseInt(req.query.currentPage))
    // console.log(page)
    // console.log(limitValue)
    try{
       let result = await sellerprofileModel.find().sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
       res.send(result)
    }catch(err){
        res.send("server error")
    }
})

router.get("/getTotalCount", async(req, res)=>{
    try{
       let result =await sellerprofileModel.estimatedDocumentCount()
    //    console.log(result)
       res.status(200).send({"result":result})
    }catch(err){
       res.status(401).send({"result":"server issue"})
    }
})



module.exports = router

