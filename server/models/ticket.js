const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  movieName: { type: String, required: true },
  theaterName: { type: String, required: true },
  showDateTime: { type: Date, required: true },
  seats: [{ type: String, required: true }],  // Array of seat numbers
  qrCode: { type: String, required: true },
  status: { type: String, enum: ['active', 'used', 'cancelled'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
