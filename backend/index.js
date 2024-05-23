const express = require("express");
const {Connect} = require("./db.js/connect.js");
const mongoose = require("mongoose")
const userRouter = require("./routes/user.js")
const cors = require("cors");
const accountRouter = require("./routes/account.js")
const app = express(); 
app.use(express.json());
app.use("/api/v1/user",userRouter);
app.use("/api/v1/account",accountRouter);
app.use(cors());
app.listen(3000,async()=>
{
    try{
        Connect();
    }
    catch(err)
    {
        console.log("error in connecting DB"); 
    }
})
