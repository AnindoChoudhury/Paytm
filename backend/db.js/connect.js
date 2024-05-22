const mongoose = require("mongoose");
const { User } =  require("../Schemas/user.model.js");

function Connect()
{
mongoose.connect("mongodb+srv://admin:4dmNTfiZtVIplxgh@cluster0.182kjcd.mongodb.net/Paytm").then(()=>{
    console.log("mongo db connected")
}).catch((err)=>
{
    console.log("error in connecting");
})

}
module.exports = {Connect};
