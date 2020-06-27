const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'this_is_for_temporary');
    req.tokenData = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
}