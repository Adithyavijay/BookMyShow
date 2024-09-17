const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const { generateAccessToken, encryptToken } = require('../utils/jwt-utils');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')


require('dotenv').config();



// Email transporter setup 
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
    });

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp) { 
  await transporter.sendMail({
    from: `"Book my show" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Email Verification',
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`
  });
}

exports.googleCallback = async (req, res) => {
    const { credential } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const email = payload['email'];

        let user = await User.findOne({email});
        if (!user) {
            user = new User({        
                email: email,
                username: payload['name'],
                profilePicture: payload['picture']
            });
            await user.save();
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Save OTP in session
        req.session.otp = {
            code: otp,
            email: user.email,
            expires: Date.now() + 5 * 60 * 1000 // 5 minutes expiration
        };   
        // Send OTP to user's email
        try{
            await sendOTPEmail(user.email, otp);
        }catch(err){
            console.err('send err ',err)
        } 

        req.session.save((err) => {
            if (err) {
                console.error('Failed to save session:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.json({ 
                message: 'OTP sent successfully', 
                user: {
                    email: user.email,
                    id: user._id,
                    name: user.username,
                    profilePicture:user.profilePicture,
                    requireTwoFactorAuth: true 
                }
            });
        });

    } catch (err) {    
        console.error('err', err);
        res.status(500).json({ message: 'Authentication failed' });
    }
};

exports.verifyEmailOTP = async (req, res) => { 
    const { otp } = req.body;

    if (!otp) {
        return res.status(400).json({ success: false, message: 'OTP is required' });
    }

    if (!req.session.otp) {
        return res.status(400).json({ success: false, message: 'No OTP session found' });
    }

    try {
        if (Date.now() > req.session.otp.expires) {
            delete req.session.otp;
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        if (otp !== req.session.otp.code) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        const user = await User.findOne({ email: req.session.otp.email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.isEmailVerified = true;
        await user.save();

        // Generate and encrypt access token
        const accessToken = generateAccessToken(user._id);
        const encryptedToken = encryptToken(accessToken);

        // Clear OTP from session
        delete req.session.otp;

        // Set encrypted token in HTTP-only cookie
        res.cookie('encryptedToken', encryptedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24* 30 * 60 * 60 * 1000 
        });

        res.json({ 
            success: true, 
            message: 'Email verified successfully', 
            user: {
                id: user._id,
                email: user.email,
                name: user.username,
                profilePicture:user.profilePicture  
            }
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
}; 

// controller logic to handle logout

exports.logout = async (req, res) => {
    try {
        // Clear the authentication cookie
        res.clearCookie('encryptedToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Send response
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Error logging out' });
    }
}; 

exports.adminLogin = async(req,res)=>{
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    // Verify credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Create a JWT token
      const token = jwt.sign(
        { email: process.env.ADMIN_EMAIL },
        process.env.JWT_SECRET,
        { expiresIn: '30d' } 
      );
  
      // Set the token as an HTTP-only cookie
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 30* 24* 60 * 60 * 1000, // 30 days
      });
  
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
} 

exports.adminLogout = async (req, res) => {
    try {
        // Clear the authentication cookie
        res.clearCookie('adminToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Send response
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Error logging out' });
    }
};  
exports.checkAuth = async(req,res)=>{
    const adminToken = req.cookies.adminToken; 
   
    if (adminToken) {
      // Verify the token 
      try {
        jwt.verify(adminToken, process.env.JWT_SECRET); 
        res.json({ isAuthenticated: true });
      } catch (error) {
        console.log(error)
        res.json({ isAuthenticated: false });
      }
    } else {
      res.json({ isAuthenticated: false });
    }
}