const JWT_Password = require("../config.js");
const jwt = require("jsonwebtoken");
function authoriseUser (req, res, next)  {
  const authToken = req.headers.authorization;
  if(!authToken || !authToken.startsWith("Bearer "))
  {
    res.status(403).json({msg : "Error"});
  }
  token = authToken.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_Password);
    next();
  } catch (err) {
    res.status(401).json({ msg: "You dont have an account" });
    return;
  }
};

module.exports = authoriseUser;
