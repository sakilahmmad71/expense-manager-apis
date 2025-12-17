import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      logger.warn('Authentication attempt without token', {
        ip: req.ip || req.connection.remoteAddress,
        url: req.url,
        method: req.method
      });
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    logger.warn('Invalid authentication token', {
      error: error.message,
      ip: req.ip || req.connection.remoteAddress,
      url: req.url,
      method: req.method
    });
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;
