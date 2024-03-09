const express = require("express");
const router = express.Router()
const AdminModel = require("../Schema/AdminSchema")
const AdminUpdateModel = require("../Schema/AdminUpdateSchema")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secretKey = "aabbcc"

router.post("/adminRegister", async (req, res) => {
    let { email, password } = req.body
    try {
        // let salt = bcrypt.genSalt(10)
        let hashedPassword = bcrypt.hashSync(password, 10)
        let user = await AdminModel({ email: email, password: hashedPassword })
        let result = user.save()
        if (result) {
            res.send("success")
        } else {
            console.log("not saved")
        }

    } catch (err) {
        res.send("backend error occred")
    }
})

router.post("/adminLogin", async (req, res) => {

    const { email, password } = (req.body)

    try {
        let user = await AdminModel.findOne({ email: email })
        if (user == null) {
            res.send("no user found")
        } else{
            console.log("35",user._id)

            let hashedPassword = user.password
            let result = bcrypt.compareSync(password, hashedPassword)
            if(result==true){
                let token = jwt.sign({id:user._id},secretKey)
                res.send({status:"success", token, id: user._id})
                console.log(user._id)

            }else{
                res.send("incorrect password")
            }
            
        }
    } catch (err) {
        res.send("backend error occred")
    }
})



router.put("/UpdateWebsite", async(req, res)=>{
    try{
        // let result = await AdminUpdateModel(req.body)
        // let data = await result.save()
        let result = await AdminUpdateModel.updateMany({$set:req.body})

if(result){
    res.send("success")
}     
    }catch(err){
        res.send("backend error")
    }
})
router.get("/getWebsiteDetails", async(req, res)=>{
    try{
        let result = await AdminUpdateModel.find()
if(result){
    res.status(201).send({Status : "success", result})
}     
    }catch(err){
        res.send("backend error")

    }
})

module.exports = router