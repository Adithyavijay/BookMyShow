// userRepository.js
import User from '../models/user.js';

/**
 * Repository class for handling user-related database operations
 */
class UserRepository {
  /**
   * @desc Retrieve all users with aggregated ticket information
   * @returns {Promise<Array>} An array of user objects with additional ticket-related fields
   */
  async getUsers() {
    return User.aggregate([
      // Join users with their tickets
      {
        $lookup: {
          from: 'tickets',
          localField: '_id',
          foreignField: 'user',
          as: 'tickets'
        }
      },
      // Add computed fields based on ticket information
      {
        $addFields: {
          // Count total tickets for each user
          totalTickets: { $size: '$tickets' },
          // Count active tickets for each user
          activeTickets: {
            $size: {
              $filter: {
                input: '$tickets',
                as: 'ticket',
                cond: { $eq: ['$$ticket.status', 'active'] }
              }
            }
          },
          // Find the date of the last booking
          lastBooking: { $max: '$tickets.createdAt' },
          // Find the name of the upcoming movie (if any)
          upcomingMovie: {
            $let: {
              vars: {
                upcomingTicket: {
                  $first: {
                    $filter: {
                      input: '$tickets',
                      as: 'ticket',
                      cond: { 
                        $and: [
                          { $eq: ['$$ticket.status', 'active'] },
                          { $gt: ['$$ticket.showDateTime', new Date()] }
                        ]
                      }
                    }
                  }
                }
              },
              in: '$$upcomingTicket.movieName'
            }
          }
        }
      },
      // Project only the fields we need
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          profilePicture: 1,
          totalTickets: 1,
          activeTickets: 1,
          lastBooking: 1,
          upcomingMovie: 1
        }
      },
      // Sort users by last booking date (descending) and then by username (ascending)
      {
        $sort: { lastBooking: -1, username: 1 }
      }
    ]);
  }
}
  
export default new UserRepository();