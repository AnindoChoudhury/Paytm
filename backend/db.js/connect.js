const mongoose = require("mongoose");
require('dotenv').config()
const { User } =  require("../Schemas/user.model.js");
function Connect()
{
mongoose.connect(`${process.env.MONGO_URL}/Paytm`).then(()=>{
    console.log("mongo db connected")
}).catch((err)=>
{
    console.log("error in connecting");
})

}


module.exports = {Connect};
