const express = require("express")
const router = express.Router()
const buyerRequestModel = require("../Schema/QgtBuyerRequestSchema")
const AdmingetQuoteModel = require("../Schema/QgtAdminRequestQuoteSchema")
const QuotesubmittedModel = require("../Schema/QgtSellerQuoteSchema")
const sellerprofileModel = require("../Schema/QgtSellerProfileSchema")
const buyerprofileModel = require("../Schema/QgtBuyerProfileSchema")
var nodemailer = require('nodemailer')
const mongoose = require("mongoose")

const { MongoClient } = require("mongodb")
// const {getData} = require("../mongodb")
const {ObjectID} = require("mongodb")
const {gtoken} = require('./QgtBuyerProfileRoute')
const secretKey = "Swami"
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


// ............get all Quotes for all......
router.get("/viewQuotes", verifyToken, async (req, res) => {
    try {
        let Items = await buyerRequestModel.find()
        res.send(Items)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

function verifyHomeQuotes(req, res, next){
    let valid=req.headers['authorization']
    if(valid==='BlueItImpulseWalkinIn'){
        next()
}else{
    res.send("Unauthorised Access")
}
}
// ............get all Home jobs for all......
router.get("/viewHomeQuotes", verifyHomeQuotes, async (req, res) => {
    try {
        let Items = await buyerRequestModel.find().select()
        res.send(Items)
    } catch (err) {
        res.status(401).send("server issue")
    }
})
// ............get all H jobs for all posted by admin for admin my posted jobs......
router.get("/getAdminQuotes", verifyHomeQuotes, async (req, res) => {
    try {
        let result = await buyerRequestModel.aggregate([{ $match: { Adminpost: true } }])
        res.send(result)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// Seller Quote postings
router.post("/requestQuote", verifyToken, async (req, res) => {
    try {
        const {Description,Link,Quantity,Unit,Comments } = (req.body)
        if ( !Description || !Link || !Quantity || !Unit) {
            res.send("fields are missing")
        } else {
            let Items = new buyerRequestModel(req.body)
            let result = await Items.save()
            res.send("success")
        }
    } catch (error) {
        // console.log(error.message)
        res.send("server issue ")
    }
})

// .........getQuotes for Quote details...........
router.get("/getQuotes/:quoteId",verifyHomeQuotes, async (req, res) => {
    try {
        let Items = await buyerRequestModel.findOne({ _quoteId: req.params.quoteId })
        res.send(Items)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// ................get my posted Quotes for Buyer.......
router.get("/getPostedQuotes/:quoteId", verifyToken, async (req, res) => {
    try {
        let jobs = await buyerRequestModel.find({ _BuyerId: req.params.id })
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue", err)
    }
})
// .......... get jobs for update for Buyer........
router.get("/getQuoteForUpdate/:quoteId",verifyHomeQuotes, async (req, res) => {
    try {
        let jobs = await buyerRequestModel.findOne({ _quoteId: req.params.quoteId })
        res.send(jobs)
    } catch (err) {
        res.status(401).send( err)
    }
})
// ..........update for Buyer Quote posts............
router.put("/updatePostedQuote/:quoteId", verifyHomeQuotes, async (req, res) => {
    try {
        let result = await buyerRequestModel.updateOne(
           { _quoteId: req.params.quoteId},
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
router.delete("/deleteQuote/:quoteId",verifyHomeQuotes, async (req, res) => {
    let result = await buyerRequestModel.deleteOne({ _quoteId: req.params.quoteId })
    if (result) {
        res.send(result)
    } else {
        res.send("error")
    }
})

// .............Search.................
router.get("/searchQuote/:key", async(req,res)=>{
    try{
    let result = await buyerRequestModel.find({
        "$or" : [
           {QuoteTitle: {$regex: req.params.key}},
           {BuyerId : {$regex : req.params.key}},
           {Description:{$regex:req.params.key}},
           {Quotetype :{$regex:req.params.key}},
           {PriceRange :{$regex:req.params.key}}
       
    ]
    })
    if(result){
        res.send(result)
    } 
}catch(err){
    res.send("error occured")
}   
})


// ..........update for Quote Seller..................
router.put("/updateforQuoteApply/:quoteId", verifyToken, async (req, res) => {
    let userId  = req.body.SellerId
    try {
        let result = await buyerRequestModel.updateOne(
           { _quoteId: req.params.quoteId},
           {$push: {SellerId:req.body}}
         )
         let job = await buyerRequestModel.findOne({_quoteId:req.params.quoteId})
         let QuoteTitle = job.QuoteTitle
        if (result) {
        let user =  await sellerprofileModel.findOne({ _id:userId})
        let Usermail  =user.email
        if(Usermail){        
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
       user: 'bluenetwrk@gmail.com',
      pass: 'vwzv axcq ywrw bxjd'
                }
              });
              var mailOptions = {
                from: 'bluenetwrk@gmail.com',
                to: Usermail,
                subject: `Succesfully Applied for the Quote ${QuoteTitle}`,
                text: "you have applied for Quote successfully",
                html: `You have Succesfully Applied for the Quote ${QuoteTitle}`+'<p>Click <a href="https://www.getquote.shop/Quotedetails/' + btoa(req.params.quoteId) + '"> here </a> to check the full details about the applied Quote</p>'
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
// ................get myappliedQuotes for .......
router.get("/getMyAppliedQuotes/:quoteId", verifyToken, async (req, res) => {
    try {
        // let jobs = await getQuoteModel.find({SellerId: req.params.id })
    let jobs = await buyerRequestModel.find({SellerId: {$elemMatch: {SellerId: req.params.quoteId }}})

        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})


// .......Undo Select , Reject, OnHold.............

router.put("/updateforUndoQuoteApplied/:quoteId", async (req, res) => {
    try {
        let result = await buyerRequestModel.updateOne(           
            {_quoteId: req.params.quoteId}, 
            {$pull:req.body}  )
        if (result) {
            res.send("success")
        }                     
    } catch (err) {
        res.send("back end error occured")
    }
})
// .......upate for undoJobApply..or delete Job Applied...........

router.put("/DeleteQuoteApplied/:quoteId", async (req, res) => {
    try {
        let result = await buyerRequestModel.updateOne(           
            {_quoteId: req.params.quoteId}, 
            {$pull:{SellerId:req.body}}  )
            if(result.matchedCount===0){
                let careerResult = await AdmingetQuoteModel.updateOne(           
                    {_quoteId: req.params.quoteId}, 
                    {$pull:{SellerId:req.body}} )
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
router.get("/getAppliedSellerIds/:id", async(req,res)=>{
    try{
        let JobIds= await buyerRequestModel.findOne({_id:req.params.id})
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
router.put("/status/:quoteId", async(req, res)=>{
    try{
        let result= await buyerRequestModel.updateOne(
            {_quoteId:req.params.quoteId},
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
        let result= await buyerRequestModel.
        updateMany(
            {},
            { $unset: { "Description": "" } }
         
        )
        if(result){
            res.send("success")
                }        
    }catch(err){
        res.send("back error occured")
    }

})

// ....delete job for admin....
router.delete("/deleteQuote/:quoteId", async (req, res) => {
    let result = await buyerRequestModel.deleteOne({ _quoteId: req.params.quoteId })
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

router.get("/getTodayPostedQuote", async(req, res)=>{ 
    try{
        let result = await buyerRequestModel.find({ createdAt: {$gte: startDay, $lte:endDay} })
        if(result){
            res.send(result)
        }
    }catch(err){
    res.send("backend Error Occured")

    }
})
// get Job Title  form 
router.get("/getQuoteTitle/:quoteId", async(req, res)=>{
    // console.log(req.params.id)
    try{
        let result = await buyerRequestModel.find({"$or":[{QuoteTitle:{$regex:req.params.quoteId}}]})
        if(result){
            res.send(result)
        }
    }catch(err){
        res.send("backend error ")
    }
})

// get  getjobLocation  form 
router.get("/getLocation/:quoteId", async(req, res)=>{
    try{
        let result = await buyerRequestModel.find({"$or":[{Location:{$regex:req.params.quoteId}}]})
        if(result){
            res.send(result)
        }
    }catch(err){
        res.send("backend error ")
    }
})
// get both jobLocation and JobTitle form 

router.post("/getBothquoteFilter/:quoteId", async(req, res)=>{
    let LocationParams = req.params.quoteId
    let TitleBody = req.body
    try{
          if(LocationParams && TitleBody)
           {
            let both=   await buyerRequestModel.find({$and: [{Location: {$regex:req.params.quoteId}},{QuoteTitle: {$regex:req.body.jobTitle}}]})
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
router.get("/getLimitquotes/:limit", verifyHomeQuotes, async(req, res)=>{
    let limitValue = (parseInt(req.params.limit))
    let page = (parseInt(req.query.currentPage))
    // console.log(page)
    // console.log(limitValue)
    try{
       let result = await buyerRequestModel.find().sort({ "createdAt": -1 }).skip((page - 1) * limitValue).limit(limitValue)
       res.send(result)
    }catch(err){
        res.send("server error")
    }
})

router.get("/getTotalCount", async(req, res)=>{
    try{
       let result =await buyerRequestModel.estimatedDocumentCount()
    //    console.log(result)
       res.status(200).send({"result":result})
    }catch(err){
       res.status(401).send({"result":"server issue"})
    }
})
//  get job by Tag filter
router.get("/getTagsquotes/:name", async(req, res)=>{
    let comingParam=req.params.name
    let convertingArray=comingParam.split(",") // ["javascript", "react", "nodejs"]
    // console.log(convertingArray)
    try{
        let result = await buyerRequestModel.aggregate([
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

router.get("/quoteTagsIds/:id", async (req, res) => {
    let limitValue = (parseInt(req.query.recordsPerPage))
    let page = (parseInt(req.query.currentPage))
    // console.log(page)
    // console.log(limitValue)
    let comingArray = req.params.id
    let spliArray = comingArray.split(",")

    try {
        // console.log("local value",['6533629f105bb11463d44bb4', '652f76a8eff06fe23539e03d','652f73966749e34e868567e1'])
        const profile = await buyerRequestModel.find({ _id: { $in: spliArray } })
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

        let foundquotes=await buyerRequestModel.find({_id:{$in:comingIds}})

        if (foundquotes.length > 0) {
            let archiveQuotes=foundquotes.map((jobs)=>{
                return(
                    jobs
                )
            })
           let insertedValue= await Archived.insertMany({Archived:archiveQuotes});
        let deletedquotes=await buyerRequestModel.deleteMany({_id:{$in:comingIds}})
        }
res.send("success")
    }catch(err){
res.send("fail")
    }
})

router.get("/getArchiveQuotes", async(req, res)=>{
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
        let foundquotes=await buyerRequestModel.find({_id:{$in:comingIds}})
        if (foundquotes.length > 0) {
            let archiveJobs=foundquotes.map((Quotes)=>{
                return(
                    Quotes
                )
            })
        let insertedValue= await Deleted.insertMany({Archived:archiveQuotes});
        let deletedquotes=await buyerRequestModel.deleteMany({_id:{$in:comingIds}})
        }
res.send("success")
    }catch(err){
res.send("fail")
    }
})

router.get("/getDeletedquotes", async(req, res)=>{
    try{
        let result =await Deleted.find({}, { Archived: 1, createdAt: 1})
        res.send(result)
    }catch(err){
        res.send("error")
    }
})

// ...............................Career JobsPost for Admin.......................

// Admin Career job postings
router.post("/AdminreqQuotes", verifyToken, async (req, res) => {
    try {
        const {Logo, empId, companyName, jobTitle, jobDescription, jobtype, 
            salaryRange, jobLocation, qualification, experiance, skills } = (req.body)
        if ( !jobDescription || !companyName || !experiance || !jobLocation) {
            res.send("field are missing")
        } else {
            let jobs = new AdmingetQuoteModel(req.body)
            let result = await jobs.save()
            res.send("success")
        }
    } catch (error) {
        // console.log(error.message)
        res.send("server issue ")
    }
})

router.get("/getAdminquotes", verifyHomeQuotes, async (req, res) => {
    try {
        let jobs = await AdmingetQuoteModel.find().select()
        res.send(jobs)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

//for Archive jobs

router.get("/getTagsArchivedSellers/:name", async(req, res)=>{
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


router.get("/ArchivedSellerTagsIds/:id", async (req, res) => {
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
router.get("/getLimitArchivedBuyer/:limit", verifyHomeQuotes, async(req, res)=>{
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

router.get("/getTotalCountArchivedBuyer", async(req, res)=>{
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

router.get("/getTagsDeletedBuyer/:name", async(req, res)=>{
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


router.get("/DeletedBuyerTagsIds/:id", async (req, res) => {
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
router.get("/getLimitDeletedBuyer/:limit", verifyHomeQuotes, async(req, res)=>{
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

router.get("/getTotalCountDeletedBuyer", async(req, res)=>{
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

    router.delete("/deleteArchivedQuotes/:ids", async (req, res) => {
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

      router.delete("/deleteDeletedQuotes/:ids", async (req, res) => {
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