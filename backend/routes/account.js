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
router.get("/balance", authoriseUser, async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const UserID = jwt.verify(token, JWT_Password).userID;
  try {
    const account = await Balance.findOne({ user: UserID });
    res.status(200).json({ balance: account.balance });
  } catch (err) {
    console.log(err);
  }
});

// transfer cash from one account to another
router.post("/transfer", authoriseUser, async (req, res) => {
  const reqBodySchema = zod.object({
    toUsernameID: zod.string(),
    amount: zod.number(),
  });
  const token = req.headers.authorization.split(" ")[1];
  const senderUserID = jwt.verify(token, JWT_Password).userID;
  if (!reqBodySchema.safeParse(req.body).success) {
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
  res.status(200).json({ msg: "Transaction successful" });
});

module.exports = router;
