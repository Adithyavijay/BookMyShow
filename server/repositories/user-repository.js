// userRepository.js
import User from '../models/user.js';

class UserRepository {
  async getUsers() {
    return User.aggregate([
      {
        $lookup: {
          from: 'tickets',
          localField: '_id',
          foreignField: 'user',
          as: 'tickets'
        }
      },
      {
        $addFields: {
          totalTickets: { $size: '$tickets' },
          activeTickets: {
            $size: {
              $filter: {
                input: '$tickets',
                as: 'ticket',
                cond: { $eq: ['$$ticket.status', 'active'] }
              }
            }
          },
          lastBooking: { $max: '$tickets.createdAt' },
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
      {
        $sort: { lastBooking: -1, username: 1 }
      }
    ]);
  }
}

export default new UserRepository();