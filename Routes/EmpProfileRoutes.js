const express = require("express");
const app = express();
const router = express.Router();
const EmpProfileModel= require("../Schema/EmpProfileSchema")
const NewEmpProfileRegistrationModel= require("../Schema/EmpNewRegistSchema")
const bcrypt = require("bcrypt")
const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const secretKey = "abcde"
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
var nodemailer = require('nodemailer');
const fs = require('fs')
const axios = require('axios');
const bodyParser = require('body-parser');
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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
        // {$set:{image: `https://itwalkin-backend-testrelease-2-0-1-0824.onrender.com/Images/${imagePath}`}}       
        // {$set:{image: `http://localhost:8080/Images/${imagePath}`}}       
        {$set:{image: `https://itwalkin-backend-testrelease-2-0-1-0824-ns0g.onrender.com/Images/${imagePath}`}} 
        // {$set:{image: `https://i-twalkin-backend-testrelease-2-0-1-0824.vercel.app/Images/${imagePath}`}} 
                   
    )
    if(result){
    res.send(result)
}
}catch(err){
    res.send("back error occured")
}
})

// delete logo rout.........

router.put("/deleteImage/:id", async (req, res) => {
    const comingImagepath=req.body.image
    // const trimImagepath=comingImagepath.replace("https://itwalkin-backend-testrelease-2-0-1-0824.onrender.com/Images/","")
    // const trimImagepath=comingImagepath.replace("http://localhost:8080/Images/","")
    const trimImagepath=comingImagepath.replace("https://itwalkin-backend-testrelease-2-0-1-0824-ns0g.onrender.com/Images/","")
    // const trimImagepath=comingImagepath.replace("https://i-twalkin-backend-testrelease-2-0-1-0824.vercel.app/Images/","")
    const filepath=`public/Images/${trimImagepath}`

    try {
        let result = await EmpProfileModel.updateOne(           
            {_id: req.params.id}, 
            {$unset:req.body},
            fs.unlinkSync(filepath, (err) => {
                if (err) {
                  console.error(`Error removing file: ${err}`);
                  return 0;
                }else{
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
    // console.log(req.body)
    try {
    let { userId, gtoken, email, name, isApproved, ipAddress } = (req.body)

        let user = await EmpProfileModel.findOne({ email: email });
        if (user == null) {
        const user = await new EmpProfileModel(req.body)
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
  let gtoken = jwt.sign({id:result._id},secretKey)
            res.send({status : "success" ,token : gtoken ,id: result._id ,action:"registered"
                })
        } else {   
            let Nowtime = Date()  
            let result = await EmpProfileModel.updateOne(
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

router.post("/NewEmployeeRegistration",  async(req, res)=>{
    // console.log(req.body)

    try{
        let User=await new EmpProfileModel(req.body)
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

// router.post('/get-token', async (req, res) => {
//     try {
//         const response = await axios.post(
//             'https://login.microsoftonline.com/ae4ae520-4db7-4149-ad51-778e540d8bec/oauth2/v2.0/token',
//             new URLSearchParams({
//                 grant_type: 'client_credentials',
//                 client_id: '097b08ff-185e-4153-aedc-0e5814e0570c',
//                 client_secret: 'D1k8Q~yOxTlSdb_LB1tW118c4827PN~c7PK6JcMr',
//                 scope: 'https://graph.microsoft.com/.default',
//             }),
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//             }
//         );
//         res.status(200).json(response.data);
//         console.log(response.data)
//     } catch (error) {
//         res.status(error.response.status).json(error.response.data);
//         console.log(error)

//     }
// });



// login for Admin in search params...
router.post("/loginforAdmin", body('email').isEmail(), async(req, res)=>{
    try{
        let {email}=req.body
        const error = validationResult(req)
        if (!error.isEmpty()) {
             return res.send("invalid email")
        }
        let user = await EmpProfileModel.findOne({email:email})
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
router.put("/updatProfile/:id", verifyToken, async (req, res) => {
    try {
        let result = await EmpProfileModel.updateOne(
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
router.get("/getAllEmployees", verifyToken, async(req, res)=>{
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
router.put("/setApproval/:id", verifyToken, async(req, res)=>{
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
router.put("/isReject/:id", verifyToken, async(req, res)=>{
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

router.put("/isOnhold/:id", verifyToken, async(req, res)=>{
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



router.get("/getApprovedEmp", verifyToken, async(req, res)=>{
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

router.get("/getNotApprovedEmp", verifyToken, async(req, res)=>{
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

router.get("/getFirmOrganisation", verifyToken, async(req, res)=>{
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

router.get("/getPvt.Ltd.Organisation", verifyToken, async(req, res)=>{
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

router.get("/getConsultancyOrganisation", verifyToken, async(req, res)=>{
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

router.get("/getTodaysEmpProfile", verifyToken, async(req, res)=>{ 
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

router.put("/sendMessage/:id", verifyToken, async(req, res)=>{
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
//  find all email only of Emplyees

router.get("/getAllemail", async(req, res)=>{
    try{
        let result= await EmpProfileModel.find({}, { email: 1, _id:0 })
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
        let result = await EmpProfileModel.find({ LogedInTime: {$gte:a , $lte:today} })
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
        let result = await EmpProfileModel.aggregate([{$match:{online:true}}])
        if (result) {
            res.send(result)
        }
    } catch (err) {
        res.send("backend Error Occured")
    }
})


// ................................Login with password.........................


module.exports = router