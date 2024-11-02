const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Retrieve the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ msg: 'Access denied. Authorization header missing.' });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Access denied. Token missing.' });
  }

  // Optional: Check if token matches a token stored in cookies (if applicable)
  const cookieToken = req.cookies.token;
  if (cookieToken && token !== cookieToken) {
    return res.status(401).json({ msg: 'Access denied. Invalid token.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    next(); 
  } catch (err) {
    return res.status(403).json({ msg: 'Access denied. Invalid or expired token.' });
  }
};

module.exports = verifyToken;
