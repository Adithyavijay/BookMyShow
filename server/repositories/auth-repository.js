import User from '../models/user.js';

/**
 * @desc Find a user by their email address
 * @param {string} email - The email address of the user to find
 * @returns {Promise<Object|null>} The user object if found, null otherwise
 */
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * @desc Create a new user in the database
 * @param {Object} userData - The user data to be saved
 * @param {string} userData.email - The email address of the user
 * @param {string} userData.username - The username of the user
 * @param {string} [userData.profilePicture] - The URL of the user's profile picture (optional)
 * @returns {Promise<Object>} The saved user object
 */
export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

/**
 * @desc Update a user's email verification status
 * @param {string} userId - The ID of the user to update
 * @returns {Promise<Object>} The updated user object
 * @throws {Error} If the user is not found
 */
export const updateUserEmailVerification = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.isEmailVerified = true;
  return await user.save();
};