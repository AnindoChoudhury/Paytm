const { Router } = require("express");
const router = Router();
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { User } = require("../Schemas/user.model.js");
const authoriseUser = require("../middlewares/authMiddleware");
const Balance = require("../Schemas/balance.model");
const jwt = require("jsonwebtoken");
const JWT_Password = require("../config.js");
const zod = require("zod");
// See balance of an user given his/her JWT token in header
router.get("/getBalance", async (req, res) => {
  let userID; 
  try{
    const token = req.headers.authorization.split(" ")[1];
     userID = jwt.verify(token, JWT_Password).userID;
  }
  catch(err)
  {
    res.status(401).json({msg : "You are not logged in" }); 
    return ; 
  }
  try {
    const user = await Balance.findOne({ user: userID });
    res.status(200).json({ balance: user.balance });
  } catch (err) {
    res.status(402).json({ msg: "Failed to fetch balance" });
    return; 
  }
});

// transfer cash from one account to another
router.post("/transfer", async (req, res) => {
  const reqBodySchema = zod.object({
    toUsernameID: zod.string(),
    amount: zod.number(),
  });
  let senderUserID ; 
  try{
    const token = req.headers.authorization.split(" ")[1];
    senderUserID = jwt.verify(token, JWT_Password).userID;
  }
 catch(err)
 {
  res.status(401).json({msg : "You are unauthorized"}); 
  return; 
 }
  if (!reqBodySchema.safeParse(req.body).success || !req.body.amount) {
    res.status(403).json({ msg: "Wrong inputs" });
    return;
  }
  // sender cannot send more amount than his balance
  // the receiver's userID should be valid
  // If server gets down in between a transaction, the whole transaction should be rolled back
  // Immediate concurrent requests should not surpass If checks
  const session = await mongoose.startSession();
  const { toUsernameID: userID, amount } = req.body;
  session.startTransaction();
  try {
    const receiver = await User.findById(userID).session(session);
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ msg: "Not a valid user" });
    return;
  }
  console.log(senderUserID) 
  if (senderUserID.toString() === userID.toString()) {
    await session.abortTransaction();
    res.status(303).json({ msg: "Self transfer is not possible" });
    return;
  }

  const sender = await Balance.findOne({ user: senderUserID });
  if (sender.balance < amount) {
    await session.abortTransaction();
    res.status(400).json({ msg: "Insufficient balance" });
    return;
  }

  // Transaction logic (credit and debit in DB)
  // Further requests are stopped if
  try {
    await Balance.findOneAndUpdate(
      { user: senderUserID },
      {
        $inc: {
          balance: -amount,
        },
      }
    ).session(session);
    await Balance.findOneAndUpdate(
      { user: userID },
      {
        $inc: {
          balance: amount,
        },
      }
    ).session(session);
  } catch (err) {
    console.log("Transaction failed " + err);
    return;
  }
  session.commitTransaction();
  res.status(200).json({ msg: "Payment successful" });
});

module.exports = router;
