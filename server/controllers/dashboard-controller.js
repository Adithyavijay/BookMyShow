// controllers/dashboard-controller.js

const User = require('../models/user');
const Ticket = require('../models/ticket');
const Movie = require('../models/movie');
const Theater = require('../models/theater');

exports.getDashboardData = async (req, res) => { 
   
  try {
    const totalUsers = await User.countDocuments();
    const totalTickets = await Ticket.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalTheaters = await Theater.countDocuments();

    // Recent Bookings (top 5 movies by ticket count in the last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentBookings = await Ticket.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$movieName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { movieName: "$_id", count: 1, _id: 0 } }
    ]);

    // Ticket Status Distribution
    const ticketStatusDistribution = await Ticket.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } }
    ]);

    res.json({
      totalUsers,
      totalTickets,
      totalMovies,
      totalTheaters,
      recentBookings,
      ticketStatusDistribution
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};