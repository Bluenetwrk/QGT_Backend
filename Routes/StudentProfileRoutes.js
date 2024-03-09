const express = require("express");
const router = express.Router();
const StudentProfileModel= require("../Schema/StudentProfileSchema")
const bcrypt = require("bcrypt")
const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const secretKey = "abcde";
var nodemailer = require('nodemailer');


const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

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
    let result= await StudentProfileModel.updateOne(
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

// delete image for studentProfile....
router.put("/deleteImage/:id", async (req, res) => {

    try {
        let result = await StudentProfileModel.updateOne(           
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
        let user = await StudentProfileModel.findOne({ phoneNumber: PhoneNumber })
        if (user == null) {
            let saveUser = await StudentProfileModel({ phoneNumber: PhoneNumber, isApproved: isApproved , ipAddress:ipAddress})
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

// .....initial login.............................
router.post("/Glogin", async (req, res) => {
    try {
    let { userId, gtoken, email, name, isApproved, ipAddress } = (req.body)

        let user = await StudentProfileModel.findOne({ email: email });
        if (user == null) {
            const user = await new StudentProfileModel({userId:userId, email:email, name:name, isApproved:isApproved , ipAddress:ipAddress})
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
// .........get userprofile to show in my profile and for update..........
router.get("/getProfile/:id", async (req, res) => {
    try {
        let result = await StudentProfileModel.findOne({ _id: req.params.id })
        if (result) {
            res.send({status:"success", result})
        } 
        
    } catch (err) {
        res.send("back end error occured")
    }
})

// .....update full student profile...........
router.put("/updatProfile/:id",  async (req, res) => {
    try {

        let result = await StudentProfileModel.updateOne(
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



// ....get total number of Jobseekers for Admin..
router.get("/getAllJobseekers", async(req, res)=>{
    try{
        let result= await StudentProfileModel.find()
        res.send(result)
    }catch(err){
        res.send("backend error occured")
    }
})

// delete jobseeker Admin API
router.delete("/deleteProfile/:id", async(req, res)=>{
    try{
        let result= await StudentProfileModel.deleteOne({_id:req.params.id})
        if(result){
            res.send("success")
        }
    }catch(err){
        res.send("backend issue")
    }
})
// update for approval from admin
router.put("/setApproval/:id", async(req, res)=>{
    try{
        let result= await StudentProfileModel.updateOne(
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
        let result= await StudentProfileModel.updateOne(
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
        let result= await StudentProfileModel.updateOne(
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

// find all Approved Jobseekers for admin
router.get("/getApprovedStu", async(req, res)=>{
    try{
        let result = await StudentProfileModel.aggregate([{$match : { isApproved : true }}])

        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")
    }
})

// find all which are not Approved Jobseekers for admin
router.get("/getNotApprovedStu", async(req, res)=>{
    try{
        let result = await StudentProfileModel.aggregate([{$match : { isApproved : false }}])

        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")
    }
})


var start = new Date();  
start.setUTCHours(0,0,0,0);

var end = new Date();
end.setUTCHours(23,59,59,999);

let startDay =start.toUTCString() 
let endDay=end.toUTCString()

router.get("/getTodayStuProfile", async(req, res)=>{ 
    try{
        let result = await StudentProfileModel.find({ createdAt: {$gte: startDay, $lte:endDay} })
        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")

    }
})

router.get("/getNoticePeriod", async(req, res)=>{
    try{
        let result = await StudentProfileModel.find({ NoticePeriod: { $lte:"20 days"} })
        if(result){
            res.send(result)
        }
    }catch(err){
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

router.put("/sendMessage/:id", async(req, res)=>{
    try{
        let result = await StudentProfileModel.updateOne({
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

