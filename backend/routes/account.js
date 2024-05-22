const { Router } = require("express");
const router = Router();
const {User} = require("../Schemas/user.model")
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
router.post("/transfer", authoriseUser,async (req, res) => {
  const reqBodySchema = zod.object({
    toUsername: zod.string(),
    amount: zod.number(),
  });
  if (!reqBodySchema.safeParse(req.body).success) {
    res.status(403).json({ msg: "Wrong inputs" });
    return;
  }
  // sender cannot send more amount than his balance
  // the receiver's userID should be valid
  // If server gets down in between a transaction, the whole transaction should be rolled back
  // Immediate concurrent requests should not surpass If checks
  const session = await mongoose.startSession();
  const {toUsername : username, amount} = req.body; 
  session.startTransaction(); 
  if(!await User.findOne({username}))
  {
    res.status.json({msg : "Such an user does not exist"}); 
    return; 
  }
  const token = req.headers.authorization.split(" ")[1];
  const UserID = jwt.verify(token, JWT_Password).userID;
  const sender = await Balance.findOne({user : UserID}); 
  if(sender.balance<amount)
  {
    res.status(202).json({msg : "Insufficient balance"});
    return ; 
  }
});
module.exports = router;



