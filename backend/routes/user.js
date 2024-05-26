const { Router } = require("express");
const { User } = require("../Schemas/user.model");
const zod = require("zod");
const router = Router();
const Balance = require("../Schemas/balance.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_Password = require("../config.js");
const authoriseUser = require("../middlewares/authMiddleware.js");
router.post("/signup", async (req, res) => {
  const { firstname, lastname, username, password } = req.body;

  const passwordSchema = zod.string().min(5);
  // All fields should exist
  if (!firstname || !lastname || !username || !password) {
    res.status(303).json({ msg: "All fields are required" });
    return;
  }
  // Zod validation for password
  if (!passwordSchema.safeParse(password).success) {
    res
      .status(400)
      .json({ msg: "password should be at least 5 characters long" });
    return;
  }
  // Prevent duplication of the same username
  if (await User.findOne({ username })) {
    res.status(303).json({ msg: "Username exists" });
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // User document creation
    const user = await User.create({
      firstname,
      lastname,
      password: hash,
      username,
    });
    // Balance document creation
    const balance = await Balance.create({
      user,
      balance: Math.floor(Math.random() * 990) + 10,
    });
    const userID = user._id;
    const token = jwt.sign({ userID, username }, JWT_Password);
    // Response is sent with a message and token
    res.status(200).json({
      msg: "Signup completed",
      token,
      username: `${firstname} ${lastname}`,
    });
  } catch (err) {
    res.send("All fields are required" + err);
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  if (!(await User.findOne({ username }))) {
    res.status(400).json({ msg: "Incorrect username" });
    return;
  }
  const user = await User.findOne({ username });
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(400).json({ msg: "Incorrect password" });
    return;
  }
  const token = jwt.sign(
    { userID: user._id, username: user.username },
    JWT_Password
  );
  res.status(200).json({
    msg: "Login done",
    username: `${user.firstname} ${user.lastname}`,
    token,
  });
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
    res.status(400).json({ msg: "Invalid inputs" });
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

router.get("/getBulk",authoriseUser, async (req, res) => {
  let decoded;
  try {
    const token = req.headers.authorization.split(" ")[1];
    decoded = jwt.verify(token, JWT_Password);
    filter = req.query.paddedFilter.slice(1);
    console.log(filter);
    const users = await User.find({
      $or: [
        {
          firstname: {
            $regex: `.*${filter}.*`,
            $options: "i",
          },
        },
        {
          lastname: {
            $regex: `.*${filter}.*`,
            $options: "i",
          },
        },
      ],
    });

    res
      .status(200)
      .json({
        users: users.map((item) => ({
          firstname: item.firstname,
          lastname: item.lastname,
          username: item.username,
          userID : item._id
        })).filter((item)=>(item.userID.toString()!==decoded.userID)),
      });
  } catch (err) {
    res.status(401).json({ msg: "You are not logged in" });
  }
});



module.exports = router;
