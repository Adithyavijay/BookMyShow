import User from '../models/user.js';

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const updateUserEmailVerification = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.isEmailVerified = true;
  return await user.save();
};