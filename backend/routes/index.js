const { Router } = require("express");
const { User } = require("../Schemas/user.model");
const zod = require("zod");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_Password = require("../config.js");
const authoriseUser = require("../middlewares/authMiddleware.js");
router.post("/signup", async (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const password = req.body.password;
  const passwordSchema = zod.string().min(5);
  // Zod validation for password
  if (!passwordSchema.safeParse(password).success) {
    res
      .status(300)
      .json({ msg: "password should be at least 5 characters long" });
    return;
  }
  // Prevent duplication of the same username
  if (await User.findOne({ username })) {
    res.status(300).json({ msg: "User already exists" });
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10); 
    const hash = await bcrypt.hash(password,salt); 
    const user = await User.create({firstname,lastname,password:hash,username});
    const userID = user._id; 
    const token = jwt.sign({userID, username},JWT_Password);
    res.status(200).json({msg : "Signup completed",token});
  } catch (err) {
    res.send("All fields are required" + err);
  }
});

router.post("/signin", authoriseUser, (req, res) => {
  res.status(200).json({ msg: "Login done" });
});

router.put("/update", authoriseUser, async (req, res) => {
  const updatedFirstName = req.body.firstname;
  const updatedLastName = req.body.lastname;
  const updatedPassword = req.body.password;
 
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, JWT_Password);
  try {
    let hashedPassword; 
    if(updatedPassword)
    {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(updatedPassword,salt);
    }
    await User.findByIdAndUpdate(decoded.userID,{
      firstname: updatedFirstName || firstname,
      lastname: updatedLastName || lastname,
      password: hashedPassword || password,
    });
    res.status(200).json({ msg: "Updated information" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: "Failed to update" });
  }
});
module.exports = router;
