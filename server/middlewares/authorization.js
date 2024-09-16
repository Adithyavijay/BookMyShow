const { decryptToken, verifyAccessToken } = require('../utils/jwt-utils');

exports.verifyUser= (req, res, next) => {
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
    console.log(decoded)

    // Attach the user ID to the request object
    req.user = { id: decoded.userId };

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};
