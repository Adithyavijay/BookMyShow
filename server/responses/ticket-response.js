// responses/ticket-response.js

/**
 * Formats a ticket for API response
 * @param {Object} ticket - The ticket object from the database
 * @returns {Object} Formatted ticket object
 */
export const formatTicket = (ticket) => {
    return {
      id: ticket._id,
      movieName: ticket.movieName,
      theaterName: ticket.theaterName,
      showDateTime: ticket.showDateTime,
      seats: ticket.seats,
      totalPrice: ticket.totalPrice,
      status: ticket.status,
      qrCode: ticket.qrCode,
      user: ticket.user ? {
        id: ticket.user._id,
        username: ticket.user.username,
        email: ticket.user.email
      } : null,
      showtime: ticket.showtime ? {
        id: ticket.showtime._id,
        startTime: ticket.showtime.startTime
      } : null,
      bookingDate: ticket.createdAt,
      totalPrice : ticket.totalPrice
    };
  };
  