import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateAccessToken, encryptToken } from '../utils/jwt-utils.js';
import { generateOTP, sendOTPEmail, verifyOTP } from '../utils/otp-utils.js';
import { findUserByEmail, createUser, updateUserEmailVerification } from '../repositories/auth-repository.js';

dotenv.config();

class AuthController {
  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  /**
   * @desc Handles Google authentication callback and OTP generation
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {string} req.body.credential - Google authentication credential
   * @param {boolean} req.body.resendOTP - Flag to indicate OTP resend request
   * @returns {Object} JSON response with user data and OTP status
   */
  googleCallback = async (req, res) => {
    const { credential, resendOTP } = req.body;
    
    try {
      let user;
  
      if (resendOTP) {
        // Resend OTP logic
        if (!req.session.otp || !req.session.otp.email) {
          return res.status(400).json({ message: 'No active session found for OTP resend' });
        }
        user = await findUserByEmail(req.session.otp.email);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      } else {
        // Initial Google sign-in logic
        const ticket = await this.googleClient.verifyIdToken({
          idToken: credential,  
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const email = payload['email'];
  
        user = await findUserByEmail(email);
        if (!user) {
          user = await createUser({        
            email: email,
            username: payload['name'],
            profilePicture: payload['picture']
          });
        }
      }
  
      const otp = generateOTP();
      
      req.session.otp = {
        code: otp,
        email: user.email,
        expires: Date.now() + 5 * 60 * 1000 // 5 minutes expiration
      };   
  
      try {
        await sendOTPEmail(user.email, otp);
      } catch(err) {
        console.error('send err ', err);
        return res.status(500).json({ message: 'Failed to send OTP email' });
      } 
  
      req.session.save((err) => {
        if (err) {
          console.error('Failed to save session:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ 
          message: resendOTP ? 'New OTP sent successfully' : 'OTP sent successfully', 
          user: {
            email: user.email,
            id: user._id,
            name: user.username,
            profilePicture: user.profilePicture,
            requireTwoFactorAuth: true 
          }
        });
      });
  
    } catch (err) {    
      console.error('err', err);
      res.status(500).json({ message: 'Authentication failed' });
    }
  }

  /**
   * @desc Resends OTP to the user's email
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {string} req.body.email - User's email address
   * @returns {Object} JSON response with OTP resend status
   */
  resendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
      const user = await findUserByEmail(email);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const newOTP = generateOTP();

      req.session.otp = {
        code: newOTP,
        email: user.email,
        expires: Date.now() + 5 * 60 * 1000 // 5 minutes expiration
      };

      try {
        await sendOTPEmail(user.email, newOTP);
      } catch (err) {
        console.error('Error sending OTP email:', err);
        return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
      }

      req.session.save((err) => {
        if (err) {
          console.error('Failed to save session:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json({ 
          success: true,
          message: 'New OTP sent successfully', 
          user: {
            email: user.email,
            id: user._id,
            name: user.username,
            profilePicture: user.profilePicture,
            requireTwoFactorAuth: true 
          }
        });
      });

    } catch (error) {
      console.error('Error resending OTP:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * @desc Verifies the OTP entered by the user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {string} req.body.otp - OTP entered by the user
   * @returns {Object} JSON response with verification status and user data
   */
  verifyEmailOTP = async (req, res) => {
    const { otp } = req.body;

    if (!otp || !req.session.otp) {
      return res.status(400).json({ success: false, message: 'OTP is required or session expired' });
    }

    try {
      verifyOTP(req.session.otp.code, otp, req.session.otp.expires);

      const user = await findUserByEmail(req.session.otp.email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      await updateUserEmailVerification(user._id);

      const accessToken = generateAccessToken(user._id);
      const encryptedToken = encryptToken(accessToken);

      delete req.session.otp;

      res.cookie('encryptedToken', encryptedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 30 * 60 * 60 * 1000 
      });

      res.json({ 
        success: true, 
        message: 'Email verified successfully', 
        user: {
          id: user._id,
          email: user.email,
          name: user.username,
          profilePicture: user.profilePicture  
        }
      });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * @desc Logs out the user by clearing the authentication cookie
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with logout status
   */
  logout = async (req, res) => {
    try {
      res.clearCookie('encryptedToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ success: false, message: 'Error logging out' });
    }
  }

  /**
   * @desc Handles admin login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {string} req.body.email - Admin email
   * @param {string} req.body.password - Admin password
   * @returns {Object} JSON response with login status and token
   */
  adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email: process.env.ADMIN_EMAIL },
        process.env.JWT_SECRET,
        { expiresIn: '30d' } 
      );

      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  }

  /**
   * @desc Logs out the admin by clearing the admin token cookie
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with logout status
   */
  adminLogout = async (req, res) => {
    try {
      res.clearCookie('adminToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ success: false, message: 'Error logging out' });
    }
  }

  /**
   * @desc Checks if the admin is authenticated
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with authentication status
   */
  checkAuth = async (req, res) => {
    const adminToken = req.cookies.adminToken; 

    if (adminToken) {
      try {
        jwt.verify(adminToken, process.env.JWT_SECRET); 
        res.json({ isAuthenticated: true });
      } catch (error) {
        console.log(error);
        res.json({ isAuthenticated: false });
      }
    } else {
      res.json({ isAuthenticated: false });
    }
  }
}

export default new AuthController();