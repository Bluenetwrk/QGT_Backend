const express = require("express");
const router = express.Router();
const EmpProfileModel= require("../Schema/EmpProfileSchema")
const bcrypt = require("bcrypt")
const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const secretKey = "abcde"
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
var nodemailer = require('nodemailer');




const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/Images');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.put("/uploadImage/:id",upload.single('image'), async (req, res)=>{
    imagePath = req.file.filename
    try{
    let result= await EmpProfileModel.updateOne(
        {_id:req.params.id},
        {$set:{image: `http://www.itwalkin.com:8080/Images/${imagePath}`}}

        

    )
    if(result){
    res.send(result)
}
}catch(err){
    res.send("back error occured")
}
})



// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, 'public/Images');
//     },
//     filename: function(req, file, cb) {   
//         cb(null, uuidv4() + "_" + Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

// router.put("/uploadImage/:id",upload.single('image'), async (req, res)=>{
//     imagePath = req.file.filename
//     try{
//     let result= await EmpProfileModel.updateOne(
//         {_id:req.params.id},
//         {$set:{image: `http://itwalkin.in:8080/Images/${imagePath}`}}
//     )
//     if(result){
//     res.send(result)
// }
// }catch(err){
//     res.send("back error occured")
// }

// })

// delete logo rout.........

router.put("/deleteImage/:id", async (req, res) => {
    try {
        let result = await EmpProfileModel.updateOne(           
            {_id: req.params.id}, 
            {$unset:req.body}
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

router.post("/otpSignUp", async (req, res)=>{
    // console.log(req.body.PhoneNumber)
    PhoneNumber =req.body.PhoneNumber
    try{
    OTP = ""
    let digits ="0123456789"
    for(let i=0; i<4; i++){
         OTP += digits[Math.floor(Math.random()*10)];
    }
client.messages
    .create({
        body:"your otp verification is " + OTP,
                from: '+13526786317',
        to: `+91${PhoneNumber}`
    })
    res.send("otp sent")
}catch(err){
    res.send("something went wrong")
}
})
router.post("/verifyOtp", async (req, res) => {
    const { isApproved , ipAddress} = req.body
    let otp = req.body.otp
    try {
        if (otp !== OTP) {
            res.send("incorrect Otp")
        }
        let user = await EmpProfileModel.findOne({ phoneNumber: PhoneNumber })
        if (user == null) {
            let saveUser = await EmpProfileModel({ phoneNumber: PhoneNumber, isApproved: isApproved  , ipAddress:ipAddress})
            let savedUser = await saveUser.save()
            if (savedUser) {
                
                let token = jwt.sign({ id: savedUser._id }, secretKey)
                res.send({ status: "success", token: token, id: savedUser._id })
            }
        }else{
        let token = jwt.sign({ id: user._id }, secretKey)
        res.send({ status: "success", token: token, id: user._id })
        }
    } catch (err) {
        res.send("backend issue")
    }
})




router.post("/Glogin", async (req, res) => {
    try {
    let { userId, gtoken, email, name, isApproved, ipAddress } = (req.body)
        let user = await EmpProfileModel.findOne({ email: email });
        if (user == null) {
            const user = await new EmpProfileModel({ email: email, name: name,  userId : userId, isApproved:isApproved, ipAddress:ipAddress })
            const result = await user.save(user)                     
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'parvaizmahroo1@gmail.com',
      pass: 'qdmz vxlw ojcx fyoj'
    }
  });
  var mailOptions = {
    from: 'parvaizmahroo1@gmail.com',
    to: result.email,
    subject: `Successfully Registered with Itwalkin`,
    html: '<p>Welcome to Itwalkin Job Portal</p>'+'<p>click <a href="http://www.itwalkin.com">itwalkin</a> to explore more </p>'
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
            res.send({status : "success" ,token : gtoken ,id: result._id})
        } else {
            res.send({status : "success" ,token : gtoken ,id: user._id})
            // console.log("user email :", user)
        }

    } catch (err) {
        res.send(err)
    }
})
// get profile for my profile  and update frofile UI
router.get("/getProfile/:id", async (req, res) => {
    try {
        let result = await EmpProfileModel.findOne({ _id: req.params.id })
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
        let result = await EmpProfileModel.findOne({ _id: req.params.id })
        if (result) {
            res.send(result.image)
        }         
    } catch (err) {
        res.send("back end error occured")
    }
})
// update full profile
router.put("/updatProfile/:id",  async (req, res) => {
    try {
        let result = await EmpProfileModel.updateOne(
            {_id: req.params.id},
           {$set:req.body
         })
        if (result) {
            res.send("success")
        } 
        
    } catch (err) {
        res.send("back end error occured")
    }
})


// ....get total number of Employees for Admin..
router.get("/getAllEmployees", async(req, res)=>{
    try{
        let result= await EmpProfileModel.find()
        res.send(result)
    }catch(err){
        res.send("backend error occured")
    }
})

// delete epmloyee API for admin
router.delete("/deleteEmployee/:id", async(req,res)=>{
    try{
        let result = await EmpProfileModel.deleteOne({_id:req.params.id})
        if(result){
            res.send("success")
        }
    }catch(err){
        res.send("server issue")
    }
})
// update for approval from admin
router.put("/setApproval/:id", async(req, res)=>{
    try{
        let result= await EmpProfileModel.updateOne(
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
router.put("/isReject/:id", async(req, res)=>{
    try{
        let result= await EmpProfileModel.updateOne(
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

router.put("/isOnhold/:id", async(req, res)=>{
    try{
        let result= await EmpProfileModel.updateOne(
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



router.get("/getApprovedEmp", async(req, res)=>{
    try{
        let result = await EmpProfileModel.aggregate([{$match : { isApproved : true }}])

// let result = await EmpProfileModel.find({"isApproved": { $exists: 1}}) // finds if the isapproved field exist or not(if exist send 1,if not send 0), not caring about wheather tue or false

        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")
    }
})
// find all which are not Approved Employeers for admin

router.get("/getNotApprovedEmp", async(req, res)=>{
    try{
        let result = await EmpProfileModel.aggregate([{$match : { isApproved : false }}])
        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")
    }
})
// find FIRM Company Type

router.get("/getFirmOrganisation", async(req, res)=>{
    try{
        let result = await EmpProfileModel.aggregate([{$match:{TypeofOrganisation:"Firm"}}])
        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")
    }
})
// find Pvt.Ltd. Company Type

router.get("/getPvt.Ltd.Organisation", async(req, res)=>{
    try{
        let result = await EmpProfileModel.aggregate([{$match:{TypeofOrganisation:"Pvt.Ltd."}}])
        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")
    }
})
// find Consultancy Company Type

router.get("/getConsultancyOrganisation", async(req, res)=>{
    try{
        let result = await EmpProfileModel.aggregate([{$match:{TypeofOrganisation:"Consultancy"}}])
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

router.get("/getTodaysEmpProfile", async(req, res)=>{ 
    try{
        let result = await EmpProfileModel.find({ createdAt: {$gte: startDay, $lte:endDay} })
        if(result){
            res.send(result)
            // console.log(result)
        }
    }catch(err){
    res.send("backend Error Occured")

    }
})

// message sending from admin

router.put("/sendMessage/:id", async(req, res)=>{
    try{
        let result = await EmpProfileModel.updateOne({
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



// ................................Login with password.........................



module.exports = router