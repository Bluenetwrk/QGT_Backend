const mongoose = require("mongoose")

const DeletedBlogs= new mongoose.Schema(
    {
        Archived:{            
        }
},
{timestamps:true}
)

const profileModel= mongoose.model("Qgt-Deleted-Blogs", DeletedBlogs)

module.exports=profileModel