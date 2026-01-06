const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  // Bearer <token>
  const tokenString = token.split(' ')[1];
  if (!tokenString) return res.status(403).json({ message: 'Malformed token' });

  jwt.verify(tokenString, process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.user = decoded;
    next();
  });
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRole };
