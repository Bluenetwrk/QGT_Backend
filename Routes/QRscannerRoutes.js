const express = require("express")
const router = express.Router()
const StudentProfileModel= require("../Schema/StudentProfileSchema")
const QRscannermodel = require("../Schema/QRScannerSchema")
const DeletedQRcodesmodel = require("../Schema/DeletedQRcodes")
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
// middleware for 
function verifyHome(req, res, next){
    let valid=req.headers['authorization']
    // console.log(valid)
    if(valid==='BlueItImpulseWalkinIn'){
        next()
}else{
    res.send("Unauthorised Access")
}
}

// employee Blog  postings
router.post("/scanQRcode",verifyToken, async (req, res) => {
    try {
        let jobs = new QRscannermodel(req.body)
        let result = await jobs.save()
        res.send("success")
    
} catch (error) {
    // console.log(error.message)
    res.send("server issue ")
}
})


// ............get all Home jobs for all......
router.get("/getAllTokens", async (req, res) => {
    try {
        let jobs = await QRscannermodel.find().select()
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

//  get job by Tag filter
router.get("/getTagsTokens/:name", async(req, res)=>{
    try{
        let result = await QRscannermodel.aggregate([{$match:{Tags:req.params.name}}]) 
        //or
    // let result = await JobpostsModel.find({Tags:  req.params.name })
    // let result = await JobpostsModel.find({Tags: {$elemMatch: {value: req.params.name }}}) //this one if for object in array in db
        res.send(result)
    }catch(err){
        res.send("server error")
    }
})

// ................get my posted Articls and questions for emplyee amd jobseeker.......
router.get("/getTokens/:id", verifyToken, async (req, res) => {
    try {
        let jobs = await QRscannermodel.find({ token: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue", err)
    }
})

// .......... get jobs for update for emplyee........
router.get("/getTokenForUpdate/:id",verifyToken, async (req, res) => {
    try {
        let jobs = await QRscannermodel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send( err)
    }
})
// ..........update for emplyee job posts............
router.put("/updateToken/:id", verifyToken, async (req, res) => {
    try {
        let result = await QRscannermodel.updateOne(
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
router.delete("/deleteToken/:id",verifyToken, async (req, res) => {
    let result = await QRscannermodel.deleteOne({ _id: req.params.id })
    if (result) {
        res.send(result)
    } else {
        res.send("error")
    }
})

// .........getJobs for job details...........
router.get("/getTokenDetails/:id",verifyHome, async (req, res) => {
    try {
        let jobs = await QRscannermodel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

router.put("/Addcomment/:id", verifyHome, async(req, res)=>{
    try{
        let result= await QRscannermodel.updateOne(
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
router.put("/deleteComment/:id", verifyHome, async(req, res)=>{
    // console.log(req.body)
    try{
        let result= await QRscannermodel.updateOne(
            {_id:req.params.id},
            {$pull: {comments:req.body}}
        )
        // console.log(result)
        if(result){
            res.send("success")
                }        
    }catch(err){
        res.send("back error occured")
    }
})


// delete CheckBox Blogs for admin
router.delete("/deleteCheckBoxArray/:ids", verifyToken, async(req, res)=>{
    let comingIds = req.params.ids.split(",") //2
    
    try{        
        let foundJobs=await QRscannermodel.find({_id:{$in:comingIds}})
        if (foundJobs.length > 0) {
            let archiveJobs=foundJobs.map((jobs)=>{
                return(
                    jobs
                )
            })
        let insertedValue= await DeletedQRcodesmodel.insertMany({Archived:archiveJobs});
        let deletedJobs=await QRscannermodel.deleteMany({_id:{$in:comingIds}})
        }
res.send("success")
    }catch(err){
res.send("fail")
    }
})

router.get("/getDeletedJobs", async(req, res)=>{
    try{
        let result =await DeletedQRcodesmodel.find({}, { Archived: 1, createdAt: 1})
        res.send(result)
    }catch(err){
        res.send("error")
    }
})

//for Deleted jobs

router.get("/getTagsDeletedBlogs/:name", async(req, res)=>{
    let comingParam=req.params.name
    let convertingArray=comingParam.split(",") // ["javascript", "react", "nodejs"]
    // console.log("686",convertingArray)
    try{
        const result = await DeletedQRcodesmodel.aggregate([
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


router.get("/DeletedBlogsTagsIds/:id", async (req, res) => {
    let limitValue = (parseInt(req.query.recordsPerPage))
    let page = (parseInt(req.query.currentPage))
    // console.log(limitValue)
    let comingArray = req.params.id
    let spliArray = comingArray.split(",")
    // console.log(spliArray)
    let arr=[ "67b5f59ed660de1cc80b6132", "67b60458d660de1cc80b6152" ]
    
    try {   
        const objectIds = spliArray.map(id => new mongoose.Types.ObjectId(id));
        const profile = await DeletedQRcodesmodel.aggregate([
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
router.get("/getLimitDeletedBlogs/:limit",  async(req, res)=>{
    let limitValue = (parseInt(req.params.limit))
    let page = (parseInt(req.query.currentPage))
    // console.log(page)
    // console.log(limitValue)
    try{
       let result = await DeletedQRcodesmodel.find({}, { Archived: 1, createdAt: 1})
       
       .sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
       res.send(result)
    // console.log("266",result)

    }catch(err){
        res.send("server error")
    }
})

router.get("/getTotalCountDeletedJobseeker", async(req, res)=>{
    try{
    //    let result =await Archived.estimatedDocumentCount()
    let response = await DeletedQRcodesmodel.aggregate([
        {
          $group: {
            _id: null,
            totalArchivedLength: { $sum: { $size: "$Archived" } }
          }
        }
      ])
    //   console.log(response)
      let result
     response.map((item)=>{
        return(
            result= item.totalArchivedLength
        )
     })
      
    //   console.log(result);
       res.status(200).send({"result":result})
    }catch(err){
       res.status(401).send({"result":"server issue"})
    //    console.log("294",err)

    }
})

//get single Archive Jobs

router.get("/getDeletedBlogProfile/:id",  async (req, res) => {
    // console.log(req.params.id)
        try {
            let result = await DeletedQRcodesmodel.findOne(
                { "Archived._id": new mongoose.Types.ObjectId(req.params.id) },
                { "Archived.$": 1 }
              );
            if (result) {
                res.send( result )
            }
        } catch (err) {
            res.send("back end error occured")
    console.log(err)
    
        }
    })

    router.delete("/deleteDeleteddBlogs/:ids", async (req, res) => {
        // console.log("called")
        try {
    // let comingIds = req.params.ids.split(",") //2
    let comingId = req.params.ids.split(",") //2
    let comingIds = comingId.map(id => new mongoose.Types.ObjectId(id));
// console.log(comingIds)
          const result = await DeletedQRcodesmodel.updateMany(
            { "Archived._id": { $in: comingIds } }, // Find any document where Archived contains these IDs
            { $pull: { Archived: { _id: { $in: comingIds } } } } // Remove matching objects from Archived
          );
          const tabledeleted = await DeletedQRcodesmodel.deleteMany({ Archived: { $size: 0 } });
// console.log(tabledeleted)
          res.status(200).json({ message: "Archived items deleted successfully", result });
        } catch (error) {
          res.status(500).json({ error: "Error deleting archived items" });
        }
      });


// Delete any field

// router.put("/deleteComment", async (req, res)=>{
//     console.log("clicked")
//     try{
//         let result= await BlogModel.updateMany({},
//             {$unset:{comments:""}}
//         )
//         console.log(result)

//     }catch(err){
//         res.send("back error occured")
//         console.log(err)

//     }
// })
module.exports=router