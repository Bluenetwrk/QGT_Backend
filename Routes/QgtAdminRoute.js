const express = require("express")
const router = express.Router()
const AdminModel = require("../Schema/QgtAdminSchema")
const AdminUpdateModel = require("../Schema/QgtAdminwebsiteupdateschema")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secretKey = "Swami"

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


router.post("/adminRegister", async (req, res) => {
    let { email, password } = req.body
    let isSuperAdmin=false
    try {
        // let salt = bcrypt.genSalt(10)
        let hashedPassword = bcrypt.hashSync(password, 10)
        let user = await AdminModel({ email: email, password: hashedPassword, isSuperAdmin: isSuperAdmin })
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
            let hashedPassword = user.password
            let result = bcrypt.compareSync(password, hashedPassword)
            if(result==true){
                // let isSuperAdmin=true
                // let result = await AdminModel.updateOne(
                //     {_id: user._id},
                //    {$set: {isSuperAdmin:isSuperAdmin}}
                // )
                let token = jwt.sign({id:user._id},secretKey)
                res.send({auth:user.isSuperAdmin, token, id: user._id})

            }else{
                res.send("incorrect password")
            }            
        }
    } catch (err) {
        res.send("backend error occred")
    }
})

// Get All Admins for SuperAdmin
router.get("/getAllAdmin", async(req, res)=>{
    try{
        let result = await AdminModel.find()
        res.send(result)
    }catch(err){
        res.send("backend error occured")
    }
})

router.delete("/deleteAdmin/:id",verifyToken, async (req, res) => {
    let result = await AdminModel.deleteOne({ _id: req.params.id })
    if (result) {
        res.send(result)
        // console.log(result)
    } else {
        res.send("error")
    }
})
router.put("/giveAccess/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUser = await AdminModel.findByIdAndUpdate(
        userId,
        { $set: req.body }    
      );  
      res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });


router.put("/UpdateWebsite", async(req, res)=>{
    // console.log(req.body)
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