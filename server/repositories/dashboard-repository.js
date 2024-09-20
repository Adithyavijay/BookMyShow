// repositories/dashboard-repository.js

import User from '../models/user.js';
import Ticket from '../models/ticket.js';
import Movie from '../models/movie.js';
import Theater from '../models/theater.js';

/**
 * Repository class for handling dashboard-related database operations
 */
class DashboardRepository {
  /**
   * @desc Get the total number of users
   * @returns {Promise<number>} Total count of users
   */
  async getTotalUsers() {
    return User.countDocuments();
  }

  /**
   * @desc Get the total number of tickets
   * @returns {Promise<number>} Total count of tickets
   */
  async getTotalTickets() {
    return Ticket.countDocuments();
  }

  /**
   * @desc Get the total number of movies
   * @returns {Promise<number>} Total count of movies
   */
  async getTotalMovies() {
    return Movie.countDocuments();
  }

  /**
   * @desc Get the total number of theaters
   * @returns {Promise<number>} Total count of theaters
   */
  async getTotalTheaters() {
    return Theater.countDocuments();
  }

  /**
   * @desc Get the top 5 most booked movies in the last 30 days
   * @returns {Promise<Array>} Array of objects containing movie names and booking counts
   */
  async getRecentBookings() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return Ticket.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$movieName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { movieName: "$_id", count: 1, _id: 0 } }
    ]);
  }

  /**
   * @desc Get the distribution of ticket statuses
   * @returns {Promise<Array>} Array of objects containing ticket statuses and their counts
   */
  async getTicketStatusDistribution() {
    return Ticket.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } }
    ]);
  }
}

export default new DashboardRepository();