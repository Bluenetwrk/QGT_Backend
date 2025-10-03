const express = require("express")
const router = express.Router()
const buyerprofileModel = require("../Schema/QgtBuyerProfileSchema")

const bcrypt = require("bcrypt")
const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const secretKey = "Swami"
var nodemailer = require('nodemailer')
const path = require('path')
const axios = require('axios')
const fs = require('fs')
const mongoose = require("mongoose")

//Midleware
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

router.post("/Glogin", async (req, res) => {
    // console.log(req.body)
    try {
    let { BuyerId, gtoken, email, name, isApproved, ipAddress } = (req.body)

        let user = await buyerprofileModel.findOne({ email: email });
        if (user == null) {
        const user = await new buyerprofileModel(req.body)
        // const user = await new EmpProfileModel({ email: email, name: name,  userId : userId, 
        //     isApproved:isApproved, ipAddress:ipAddress})
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
    subject: `Successfully Registered with Quotegenerator`,
    html: '<p>Welcome to QuotationGenerator</p>'+'<p>click <a href="http://getquote.shop">QuoteGenerator</a> to explore more </p>'
  };
  
  transporter.sendMail(mailOptions,  function(error, info){
    if (error) {
    //   console.log(error);
    //    res.send("could not send the mail")
    } else {
    //   console.log('Email sent: ' + info.response);
    //    res.send(" mail sent succesfully")
    }
  });
  let gtoken = jwt.sign({id:result._id},secretKey)
            res.send({status : "success" ,token : gtoken ,id: result._id ,action:"registered"
                })
        } else {   
            let Nowtime = Date()  
            let result = await buyerprofileModel.updateOne(
                {_id: user._id},
               {$set: {LogedInTime:Nowtime}}
            )
            let gtoken = jwt.sign({id:user._id},secretKey)
            res.send({status : "success" ,token : gtoken ,id: user._id, action:"login"})
        }
    } catch (err) {
        res.send(err)
    }
})

router.post("/NewBuyerRegistration",  async(req, res)=>{
    // console.log(req.body)

    try{
        let User=await new buyerprofileModel(req.body)
        let result=await User.save()
        const response = await axios.post(
            'https://login.microsoftonline.com/ae4ae520-4db7-4149-ad51-778e540d8bec/oauth2/v2.0/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: '097b08ff-185e-4153-aedc-0e5814e0570c',
                client_secret: 'D1k8Q~yOxTlSdb_LB1tW118c4827PN~c7PK6JcMr',
                scope: 'https://graph.microsoft.com/.default',
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        res.json(response.data);
        // console.log(response.data.access_token)
    } catch (error) {
        res.json(error.code);
        // console.log(error.code)
    }
    
    
})

// login for Admin in search params...
router.post("/loginforAdmin", body('email').isEmail(), async(req, res)=>{
    try{
        let {email}=req.body
        const error = validationResult(req)
        if (!error.isEmpty()) {
             return res.send("invalid email")
        }
        let user = await buyerprofileModel.findOne({email:email})
        if(user==null){
            res.send("user not registered")
        }else{
            // res.send(user)
            let token = jwt.sign({ id: user._id }, secretKey)
            res.send({ status: "success", id: user._id, token })
        }
    }catch(err){
        res.send("back end error occured")
    }
})

// get profile for my profile  and update frofile UI
function CheckComp(req, res, next){
    let valid=req.headers['authorization']
    if(valid==='BlueItImpulseWalkinIn'){
        next()
}else{
    res.send("Unauthorised Access")
}
}
router.get("/getProfile/:id", CheckComp, async (req, res) => {
    try {
        let result = await buyerprofileModel.findOne({ _id: req.params.id })
        if (result) {
            res.send({status:"success", result})
        } 
        
    } catch (err) {
        res.send("back end error occured")
    }
})
// get only company logo from from profile for job posts
router.get("/getLogo/:id", async (req, res) => {
    try {
        let result = await buyerprofileModel.findOne({ _id: req.params.id })
        if (result) {
            res.send(result.image)
        }         
    } catch (err) {
        res.send("back end error occured")
    }
})
// update full profile
router.put("/updateProfile/:id", verifyToken, async (req, res) => {
    try {
        let result = await buyerprofileModel.updateOne(
            {_id: req.params.id},
           {$set:req.body}
        )
        if (result) {
            res.send("success")
        } 
        
    } catch (err) {
        res.send("back end error occured")
    }
})


// ....get total number of Employees for Admin..
router.get("/getAllBuyers", verifyToken, async(req, res)=>{
    try{
        let result= await buyerprofileModel.find()
        res.send(result)
    }catch(err){
        res.send("backend error occured")
    }
})
// delete BuyerProfile API
router.delete("/deleteProfile/:id", async (req, res) => {
    try {
        let result = await buyerprofileModel.deleteOne(
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
// delete epmloyee API for admin
router.delete("/deleteBuyer/:id", async(req,res)=>{
    try{
        let result = await buyerprofileModel.deleteOne({_id:req.params.id})
        if(result){
            res.send("success")
        }
    }catch(err){
        res.send("server issue")
    }
})
// update for approval from admin
router.put("/setApproval/:id", verifyToken, async(req, res)=>{
    try{
        let result= await buyerprofileModel.updateOne(
            {_id:req.params.id},
            {$set:req.body}
        )
        if(result){
            res.send("success")
        }
    }catch(err){
        res.send("backend error occured")
    }
})

// update for Reject from admin
router.put("/isReject/:id", verifyToken, async(req, res)=>{
    try{
        let result= await buyerprofileModel.updateOne(
            {_id:req.params.id},
            {$set:req.body}
        )
        if(result){
            res.send("success")
        }
    }catch(err){
        res.send("backend error occured")
    }
})
// isOnhold status from admin

router.put("/isOnhold/:id", verifyToken, async(req, res)=>{
    try{
        let result= await buyerprofileModel.updateOne(
            {_id:req.params.id},
            {$set:req.body}
        )
        if(result){
            res.send("success")
        }
    }catch(err){
        res.send("backend error occured")
    }
})



router.get("/getApprovedBuyer", verifyToken, async(req, res)=>{
    try{
        let result = await buyerprofileModel.aggregate([{$match : { isApproved : true }}])

// let result = await EmpProfileModel.find({"isApproved": { $exists: 1}}) // finds if the isapproved field exist or not(if exist send 1,if not send 0), not caring about wheather tue or false

        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")
    }
})
// find all which are not Approved Employeers for admin

router.get("/getNotApprovedBuyer", verifyToken, async(req, res)=>{
    try{
        let result = await buyerprofileModel.aggregate([{$match : { isApproved : false }}])
        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")
    }
})

// find FIRM Company Type

router.get("/getFirmOrganisation", verifyToken, async(req, res)=>{
    try{
        let result = await buyerprofileModel.aggregate([{$match:{TypeofOrganisation:"Firm"}}])
        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")
    }
})
// find Pvt.Ltd. Company Type

router.get("/getPvt.Ltd.Organisation", verifyToken, async(req, res)=>{
    try{
        let result = await buyerprofileModel.aggregate([{$match:{TypeofOrganisation:"Pvt.Ltd."}}])
        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")
    }
})
// find Consultancy Company Type

router.get("/getConsultancyOrganisation", verifyToken, async(req, res)=>{
    try{
        let result = await buyerprofileModel.aggregate([{$match:{TypeofOrganisation:"Consultancy"}}])
        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")
    }
})

// find For todays date 
var start = new Date();  
start.setUTCHours(0,0,0,0);

var end = new Date();
end.setUTCHours(23,59,59,999);

let startDay =start.toUTCString() 
let endDay=end.toUTCString()

router.get("/getTodaysBuyerProfile", verifyToken, async(req, res)=>{ 
    try{
        let result = await buyerprofileModel.find({ createdAt: {$gte: startDay, $lte:endDay} })
        if(result){
            res.send(result)
            // console.log(result)
        }
    }catch(err){
    res.send("backend Error Occured")

    }
})

// message sending from admin

router.put("/sendMessage/:id", verifyToken, async(req, res)=>{
    try{
        let result = await buyerprofileModel.updateOne({
            _id:req.params.id},
            {$set : req.body
        })
        if(result){
            res.send("success")
        }        
    }catch(err){
        res.send("some error occured")
    }
})
//  find all email only of Emplyees

router.get("/getAllemail", async(req, res)=>{
    try{
        let result= await buyerprofileModel.find({}, { email: 1, _id:0 })
        res.send( result)
    }catch(err){
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
router.get("/RecentLogin",  async(req, res)=>{
    try{
        let result = await buyerprofileModel.find({ LogedInTime: {$gte:a , $lte:today} })
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
        let result = await buyerprofileModel.aggregate([{$match:{online:true}}])
        if (result) {
            res.send(result)
        }
    } catch (err) {
        res.send("backend Error Occured")
    }
})



router.get("/getTagsItems/:name", async(req, res)=>{
    let comingParam=req.params.name
    let convertingArray=comingParam.split(",")
    // console.log(convertingArray)
    try{
        let result = await buyerprofileModel.aggregate([
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
        const profile = await buyerprofileModel.find({ _id: { $in: spliArray } })
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
router.get("/getLimitItem/:limit", verifyHomeQuotes, async(req, res)=>{

    let limitValue = (parseInt(req.params.limit))
    let page = (parseInt(req.query.currentPage))
    // console.log(page)
    // console.log(limitValue)
    try{
       let result = await buyerprofileModel.find()
       .sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
       res.send(result)
    }catch(err){
        res.send("server error")
    }
})

router.get("/getTotalCount", async(req, res)=>{
    try{
       let result =await buyerprofileModel.estimatedDocumentCount()
       res.status(200).send({"result":result})
    }catch(err){
       res.status(401).send({"result":"server issue"})
    }
})


module.exports = router
