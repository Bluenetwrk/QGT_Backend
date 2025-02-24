
const express = require("express")
const router = express.Router()
const JobpostsModel = require("../Schema/PostJobSchema")
const CareerJobpostsModel = require("../Schema/CareerJobSchema")
const JobAppliedModel = require("../Schema/JobAppliedSchema")
const StudentProfileModel= require("../Schema/StudentProfileSchema")
const Archived= require("../Schema/ArchiveJobsAchema")
const DeletedBlog= require("../Schema/DeletedBlogSchema")
var nodemailer = require('nodemailer');
const mongoose = require("mongoose");

const { MongoClient } = require("mongodb")
// const {getData} = require("../mongodb")
const {ObjectID} = require("mongodb")
const {gtoken} = require('./EmpProfileRoutes')
const secretKey = "abcde"
const jwt = require("jsonwebtoken")

const BlogModel=require("../Schema/PostBlogsSchema")


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
router.post("/blogpost",  async (req, res) => {
    try {
            let jobs = new BlogModel(req.body)
            let result = await jobs.save()
            res.send("success")
        
    } catch (error) {
        // console.log(error.message)
        res.send("server issue ")
    }
})

// ............get all Home jobs for all......
router.get("/getAllBlogs",  async (req, res) => {
    try {
        let jobs = await BlogModel.find().select()
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

//  get job by Tag filter
router.get("/getTagsJobs/:name", async(req, res)=>{
    try{
        let result = await BlogModel.aggregate([{$match:{Tags:req.params.name}}]) 
        //or
    // let result = await JobpostsModel.find({Tags:  req.params.name })
    // let result = await JobpostsModel.find({Tags: {$elemMatch: {value: req.params.name }}}) //this one if for object in array in db
        res.send(result)
    }catch(err){
        res.send("server error")
    }
})

// ................get my posted Articls and questions for emplyee amd jobseeker.......
router.get("/getPostedjobs/:id", verifyToken, async (req, res) => {
    try {
        let jobs = await BlogModel.find({ empId: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue", err)
    }
})

// .......... get jobs for update for emplyee........
router.get("/getJobForUpdate/:id",verifyToken, async (req, res) => {
    try {
        let jobs = await BlogModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send( err)
    }
})
// ..........update for emplyee job posts............
router.put("/updatPostedJob/:id", verifyToken, async (req, res) => {
    try {
        let result = await BlogModel.updateOne(
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
    let result = await BlogModel.deleteOne({ _id: req.params.id })
    if (result) {
        res.send(result)
    } else {
        res.send("error")
    }
})

// .........getJobs for job details...........
router.get("/getjobs/:id",verifyHome, async (req, res) => {
    try {
        let jobs = await BlogModel.findOne({ _id: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

router.put("/Addcomment/:id", verifyHome, async(req, res)=>{
    try{
        let result= await BlogModel.updateOne(
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
router.put("/deletComment/:id", verifyHome, async(req, res)=>{
    // console.log(req.body)
    try{
        let result= await BlogModel.updateOne(
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
        let foundJobs=await BlogModel.find({_id:{$in:comingIds}})
        if (foundJobs.length > 0) {
            let archiveJobs=foundJobs.map((jobs)=>{
                return(
                    jobs
                )
            })
        let insertedValue= await DeletedBlog.insertMany({Archived:archiveJobs});
        let deletedJobs=await BlogModel.deleteMany({_id:{$in:comingIds}})
        }
res.send("success")
    }catch(err){
res.send("fail")
    }
})

router.get("/getDeletedJobs", async(req, res)=>{
    try{
        let result =await DeletedBlog.find({}, { Archived: 1, createdAt: 1})
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
        const result = await DeletedBlog.aggregate([
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
        const profile = await DeletedBlog.aggregate([
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
       let result = await DeletedBlog.find({}, { Archived: 1, createdAt: 1})
       
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
    let response = await DeletedBlog.aggregate([
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
            let result = await DeletedBlog.findOne(
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