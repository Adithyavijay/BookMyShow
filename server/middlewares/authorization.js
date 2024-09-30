import {decryptToken, verifyAccessToken } from '../utils/jwt-utils.js';
import jwt from 'jsonwebtoken';

export const verifyUser= (req, res, next) => {
  // Check if the token exists in the cookies
  const encryptedToken = req.cookies.encryptedToken;

  if (!encryptedToken) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  try {
    // Decrypt the token
    const decryptedToken = decryptToken(encryptedToken);

    // Verify the decrypted token
    const decoded = verifyAccessToken(decryptedToken);

    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    } 

    // Attach the user ID to the request object
    req.user = { id: decoded.userId };

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};


export const verifyAdmin = (req, res, next) => { 
  // Check if the admin token exists in the cookies
  const adminToken = req.cookies.adminToken;

  if (!adminToken) {
    return res.status(401).json({ success: false, message: 'Admin not authorized' });
  }
 
  try {
    // Verify the admin token
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

    // Check if the decoded token contains the admin email
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: 'Not an admin user' });
    }
  

    // Attach the admin info to the request object
    req.admin = { email: decoded.email };

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in admin auth middleware:', error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, message: 'Admin token expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid admin token' });
  }
};

