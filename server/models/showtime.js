  const mongoose = require('mongoose');

  const seatSchema = new mongoose.Schema({
    seatNumber: String,
    isBooked: { type: Boolean, default: false }
  });

  const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number, required: true },
    screenType: String,
    isCancellable: { type: Boolean, default: true },
    seats: [seatSchema],
    totalSeats: { type: Number, default: 100 }
  });

  showtimeSchema.virtual('availableSeats').get(function() {
    if (!this.seats || !Array.isArray(this.seats)) {
      return this.totalSeats; // Return total seats if seats array is not defined
    }
    return this.totalSeats - this.seats.filter(seat => seat.isBooked).length;
  });

  showtimeSchema.index({ movie: 1, theater: 1, date: 1 });

  showtimeSchema.methods.initializeSeats = function() {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    this.seats = rows.flatMap(row => 
      Array.from({ length: 10 }, (_, i) => ({
        seatNumber: `${row}${i + 1}`,
        isBooked: false
      }))
    );
    this.totalSeats = this.seats.length;
  };

  showtimeSchema.methods.updateAvailableSeats = function() {
    const bookedSeats = this.seats.filter(seat => seat.isBooked).length;
    this.availableSeats = this.totalSeats - bookedSeats;
  };

  showtimeSchema.set('toJSON', { virtuals: true });
  showtimeSchema.set('toObject', { virtuals: true });

  module.exports = mongoose.model('Showtime', showtimeSchema);