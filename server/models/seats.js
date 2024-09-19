import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  row: { type: Number, required: true },
  number: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
});

export default mongoose.model('Seat', seatSchema);