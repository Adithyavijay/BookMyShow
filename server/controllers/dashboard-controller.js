// controllers/dashboard-controller.js

import DashboardRepository from '../repositories/dashboard-repository.js';

/**
 * Controller for handling dashboard-related operations
 */
class DashboardController {
  /**
   * @desc Fetches and compiles various data for the dashboard
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with compiled dashboard data
   */
  async getDashboardData(req, res) {
    try { 
      // Fetch all required data concurrently for better performance
      const [
        totalUsers,
        totalTickets,
        totalMovies,
        totalTheaters,
        recentBookings,
        ticketStatusDistribution
      ] = await Promise.all([
        DashboardRepository.getTotalUsers(),
        DashboardRepository.getTotalTickets(),
        DashboardRepository.getTotalMovies(),
        DashboardRepository.getTotalTheaters(),
        DashboardRepository.getRecentBookings(),
        DashboardRepository.getTicketStatusDistribution()
      ]);

      // Compile and send the dashboard data
      res.json({
        totalUsers,
        totalTickets,
        totalMovies,
        totalTheaters,
        recentBookings,
        ticketStatusDistribution
      });
    } catch (error) {
      // Log the error and send a generic error response
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ message: 'Error fetching dashboard data' });
    }
  }
}

export default new DashboardController();