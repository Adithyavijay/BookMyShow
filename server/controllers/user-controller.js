// userController.js
import userRepository from '../repositories/user-repository.js';
import { formatUserResponse } from '../responses/user-response.js';

/**
 * Controller for handling user-related operations
 */
class UserController {
  /**
   * @desc Retrieves all users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with all users
   */
  async getUsers(req, res) {
    try {
      const users = await userRepository.getUsers();
      const formattedUsers= users.map(formatUserResponse)
      console.log(formattedUsers)
      res.json({ status : true , message : "Users fetched successfully", data : formattedUsers});
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  }
}

const userController = new UserController();
export default userController;