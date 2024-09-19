import transporter from '../config/email-config.js';

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Book my show" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Email Verification',
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`
  });
};

export const verifyOTP = (sessionOTP, inputOTP, expirationTime) => {
  if (Date.now() > expirationTime) {
    throw new Error('OTP has expired');
  }
  if (inputOTP !== sessionOTP) {
    throw new Error('Invalid OTP');
  }
  return true;
};