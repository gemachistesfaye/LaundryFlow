const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and user role
 * @param {Array} roles - Allowed roles for this route
 */
const protect = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.get('authorization') || req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = decoded;

      // Check if user role is allowed
      if (roles.length > 0 && !roles.includes(decoded.role.toLowerCase())) {
        return res.status(403).json({ success: false, message: "Access denied: Unauthorized role" });
      }

      next();
    } catch (err) {
      res.status(401).json({ success: false, message: "Token is not valid" });
    }
  };
};

module.exports = { protect };
