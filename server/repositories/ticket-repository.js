// ticketRepository.js
import Ticket from '../models/ticket.js';

/**
 * Repository class for handling ticket-related database operations
 */
class TicketRepository {
  /**
   * @desc Retrieve a ticket by its ID
   * @param {string} id - The ID of the ticket to find
   * @returns {Promise<Object|null>} The ticket object if found, null otherwise
   */
  async findById(id) {
    return await Ticket.findById(id);
  }

  /**
   * @desc Retrieve all tickets with populated user and showtime information
   * @returns {Promise<Array>} An array of all ticket objects, sorted by creation date in descending order
   */
  async findAll() {
    return await Ticket.find()
      .populate('user', 'username email')
      .populate('showtime', 'startTime')
      .sort({ createdAt: -1 });
  }

  /**
   * @desc Retrieve all tickets for a specific user
   * @param {string} userId - The ID of the user whose tickets to retrieve
   * @returns {Promise<Array>} An array of ticket objects for the specified user, 
   *                           sorted by show date and time in descending order
   */
  async findByUserId(userId) {
    return await Ticket.find({ user: userId })
      .sort({ showDateTime: -1 })
      .select('movieName theaterName showDateTime seats status qrCode');
  }
}

export default new TicketRepository();