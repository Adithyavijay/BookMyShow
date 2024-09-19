// repositories/dashboard-repository.js

import User from '../models/user.js';
import Ticket from '../models/ticket.js';
import Movie from '../models/movie.js';
import Theater from '../models/theater.js';

class DashboardRepository {
  async getTotalUsers() {
    return User.countDocuments();
  }

  async getTotalTickets() {
    return Ticket.countDocuments();
  }

  async getTotalMovies() {
    return Movie.countDocuments();
  }

  async getTotalTheaters() {
    return Theater.countDocuments();
  }

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

  async getTicketStatusDistribution() {
    return Ticket.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } }
    ]);
  }
}

export default new DashboardRepository();