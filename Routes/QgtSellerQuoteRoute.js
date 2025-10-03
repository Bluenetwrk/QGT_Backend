const express = require("express")
const router = express.Router()
const buyerRequestModel = require("../Schema/QgtBuyerRequestSchema")
const AdmingetQuoteModel = require("../Schema/QgtAdminRequestQuoteSchema")
const SellerQuoteModel = require("../Schema/QgtSellerQuoteSchema")
const sellerprofileModel = require("../Schema/QgtSellerProfileSchema")
const buyerprofileModel = require("../Schema/QgtBuyerProfileSchema")

var nodemailer = require('nodemailer');
const mongoose = require("mongoose")
const { MongoClient } = require("mongodb")
// const {getData} = require("../mongodb")
const {ObjectID} = require("mongodb")
const {gtoken} = require('./QgtSellerProfileRoute')
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

function verifyHomeQuotes(req, res, next){
    let valid=req.headers['authorization']
    if(valid==='BlueItImpulseWalkinIn'){
        next()
}else{
    res.send("Unauthorised Access")
}
}

//get submitted Quotes
router.get("/getQuotes", verifyToken, async (req, res) => {
    try {
        let Items = await SellerQuoteModel.find()
        res.send(Items)
    } catch (err) {
        res.status(401).send("server issue")
    }
})
//get submitted Quotes with quoteID
router.get("/getQuotes/:quoteId", verifyToken, async (req, res) => {
    try {
        let Items = await SellerQuoteModel.find()
        res.send(Items)
    } catch (err) {
        res.status(401).send("server issue")
    }
})

// Get quotes for a buyer
router.get('/buyer/:quoteId', async (req, res) => {
    const quotes = await SellerQuoteModel.find({ quoteId: req.params.quoteId });
    res.json(quotes);
  });
  
  
// Send a quote
router.post('/', async (req, res) => {
    try {
      const quote = new SellerQuoteModel(req.body);
      await quote.save();
      res.status(201).json({ message: 'Quote sent!' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to send quote' });
    }
  });
  // Update quote status
router.patch('/:quoteId/status', async (req, res) => {
    const { status } = req.body;
    await SellerQuoteModel.findByIdAndUpdate(req.params.quoteId, { status });
    res.json({ message: 'Status updated!' });
  });
  
  module.exports = router