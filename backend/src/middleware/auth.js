const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization || '';

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
      req.user = jwt.verify(token, secret);
      next();
  } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
  }
};