const { Router } = require("express");
const { User } = require("../Schemas/user.model");
const zod = require("zod");
const router = Router();
const Balance = require("../Schemas/balance.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_Password = require("../config.js");
const authoriseUser = require("../middlewares/authMiddleware.js");
const { setDriver } = require("mongoose");
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
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({
      firstname,
      lastname,
      password: hash,
      username,
    });
    const balance = await Balance.create({ user , balance : Math.floor(Math.random()*990)+10});
    const userID = user._id;
    const token = jwt.sign({ userID, username }, JWT_Password);
    res.status(200).json({ msg: "Signup completed", token });
  } catch (err) {
    res.send("All fields are required" + err);
  }
});

router.post("/signin", authoriseUser, (req, res) => {
  res.status(200).json({ msg: "Login done" });
});

router.put("/update", authoriseUser, async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, JWT_Password);

  const bodySchema = zod.object({
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
    password: zod.string().min(5).optional(),
  });

  if (!bodySchema.safeParse(req.body).success) {
    res.status(303).json({ msg: "Invalid inputs" });
    return;
  }

  try {
    let hashedPassword;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }
    await User.findByIdAndUpdate(decoded.userID, req.body);
    res.status(200).json({ msg: "Updated information" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: "Failed to update" });
  }
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstname: {
          $regex: filter,
        },
      },
      {
        lastname: {
          $regex: filter,
        },
      },
    ],
  });
  res.json({
    users: users.map((item) => ({
      firstname: item.firstname,
      lastname: item.lastname,
      username: item.username,
    })),
  });
});
module.exports = router;
