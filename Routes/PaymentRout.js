const express = require("express")
const router = express.Router()
const Razorpay = require('razorpay');
const keyId='rzp_test_h3n5NBOXNqdSAs'
const SecretKey = 'Po87Jfa74x4Saxjo2SCPz5zw'
const crypto = require("crypto")
const PaymentModel = require("../Schema/PaymentReceiptSchema")
const axios =require("axios")
var nodemailer = require('nodemailer');



router.post("/rzrPayment", async(req,res)=>{
    // console.log(req.body)
    try{
var instance = new Razorpay({ key_id: keyId , key_secret: SecretKey })

var options = {
  amount: req.body.Amount*100, // amount in the smallest currency unit
  currency: "INR",
};
instance.orders.create(options, function(err, order) {
    if(err){
        res.send(" error while creating payment")
    }
    return res.send({status:"order created successfully",order})
})
    }catch(err){
        res.send("backend error")
    }
})

router.post("/verifyPament", async(req, res)=>{
    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
    var expectedSignature = crypto.createHmac('sha256', SecretKey)
    .update(body.toString())
    .digest('hex');

    if(expectedSignature===req.body.response.razorpay_signature){
        res.send("valid signature")
    }else{
        res.send("invalid signature")
    }
})

router.post("/savePymentReciept", async(req,res)=>{
    try{
        let result = await PaymentModel(req.body)
        let paymentResult = await result.save()
        if(paymentResult){
            res.send(" reciept saccessfully saved")
            // var transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //       user: 'parvaizmahroo1@gmail.com',
            //       pass: 'qdmz vxlw ojcx fyoj'
            //     }
            //   });
            //   console.log(paymentResult)
            //   var mailOptions = {
            //     from: 'parvaizmahroo1@gmail.com',
            //     to: 'blueimpulse2517@gmail.com',
            //     subject: 'Sending Email using Node.js',
            //     text: "text",
            //     context:paymentResult
            //   };
              
            //   transporter.sendMail(mailOptions, function(error, info){
            //     if (error) {
            //       console.log(error);
            //       res.send("could not send the mail")
            //     } else {
            //       console.log('Email sent: ' + info.response);
            //       res.send(" mail sent succesfully")

            //     }
            //   });
        }else{
            res.send("could not save the reciept")
        }
    }catch(err){
res.send("back end error")
console.log(err)
    }
})

router.post("/phonePayPayment", async(req,res)=>{
  // console.log(req.body.amount)
  const merchantTransactionId = 'MT7850590068188104'

  const data = {    
      merchantId: "PGTESTPAYUAT",
      merchantTransactionId: merchantTransactionId,
      merchantUserId: "MUID123",
      // name: req.body
      amount: req.body.amount*100,
      redirectUrl: `http://ec2-15-206-28-178.ap-south-1.compute.amazonaws.com:8080/paymentAPI/status/${merchantTransactionId}`,
      redirectMode: "POST",
      // callbackUrl: "https://webhook.site/callback-url",
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE"      
    }
  };
  const payload = JSON.stringify(data);
  const payloadMain = Buffer.from(payload).toString('base64');
  const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
  const keyIndex = 1;
  const string = payloadMain + '/pg/v1/pay' + key;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + '###' + keyIndex;
  const axios = require('axios');

  const URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'
  // const URL = 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
const options = {
  method: 'POST',
  url: URL,
  headers: {
    accept: 'application/json', 
  'Content-Type': 'application/json',
  'X-VERIFY': checksum
},
data:{
  request: payloadMain
}
};

axios
  .request(options)
  .then(function (response) {
    // console.log('line no 130',response.data.data.instrumentResponse.redirectInfo);
    // console.log('line no 131',response.data.data.instrumentResponse.redirectInfo.url);
    return res.status(200).send(response.data.data.instrumentResponse.redirectInfo.url)
    // return res.redirect(response.data.data.instrumentResponse.redirectInfo.url)

  })
  .catch(function (error) {
    // console.error(error);
  });
})

router.post("/status/:txid", async(req, res) => {
  console.log("line no 142", req.body)
  const merchantTransactionId = res.req.body.transactionId
  const merchantId = res.req.body.merchantId
  const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"

  const keyIndex = 1;
  const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + key;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + "###" + keyIndex;

  const options = {
  method: 'GET',

  url : `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,

  // url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
  headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'X-MERCHANT-ID': `${merchantId}`
  }
  };

  // CHECK PAYMENT TATUS
  axios.request(options)
  .then(async(response) => {
    // console.log("line no 169",response.data)

      if (response.data.success === true) {
          const url = `http://ec2-15-206-28-178.ap-south-1.compute.amazonaws.com:8080/success`
          return res.redirect(url)
      } else {
          const url = `http://ec2-15-206-28-178.ap-south-1.compute.amazonaws.com:8080/failure`
          return res.redirect(url)
      }
  })
  .catch((error) => {
      // console.error("line no 181",error);
  });
});





module.exports=router