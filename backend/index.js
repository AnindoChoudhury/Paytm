const express = require("express");
const {Connect} = require("./db.js/connect.js");
const userRouter = require("./routes/index.js")
const cors = require("cors");
const app = express(); 
app.use(express.json());
app.use("/api/v1",userRouter);
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
