// ticketRepository.js
import Ticket from '../models/ticket.js';

class TicketRepository {
  async findById(id) {
    return await Ticket.findById(id);
  }

  async findAll() {
    return await Ticket.find()
      .populate('user', 'username email')
      .populate('showtime', 'startTime')
      .sort({ createdAt: -1 });
  }

  async findByUserId(userId) {
    return await Ticket.find({ user: userId })
      .sort({ showDateTime: -1 })
      .select('movieName theaterName showDateTime seats status qrCode');
  }
}

export default new TicketRepository();