const mongoose = require("mongoose"); 

const balanceSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'User', 
        required : true, 
    }, 
    balance : {
        type : Number, 
        required : true
    }
})

const Balance = mongoose.model("Balance",balanceSchema); 

module.exports=Balance; 