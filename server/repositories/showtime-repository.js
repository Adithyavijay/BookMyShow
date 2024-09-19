// repositories/showtime-repository.js

import Showtime from '../models/showtime.js';
import Booking from '../models/booking.js';
import Ticket from '../models/ticket.js';
import mongoose from 'mongoose';


const showtimeRepository = {
  create: async (showtimeData) => {
    const newShowtime = new Showtime(showtimeData);
    newShowtime.initializeSeats();
  
    await newShowtime.save();
    return Showtime.findById(newShowtime._id)
      .populate('movie', 'title')
      .populate('theater', 'name');
  },

  findAll: async () => {
    return Showtime.find()
      .populate('movie', 'title')
      .populate('theater', 'name');
  },

  findByMovie: async (movieId) => {
    return Showtime.find({ movie: movieId })
      .populate('movie', 'title language genre certificate')
      .populate('theater', 'name location');
  },

  findById: async (id) => {
    return Showtime.findById(id)
      .populate('movie', 'title theaters duration')
      .populate('theater', 'name');
  },

  update: async (id, updateData) => {
    return Showtime.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('movie')
      .populate('theater');
  },

  delete: async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const showtime = await Showtime.findById(id).session(session);
      if (!showtime) {
        throw new Error('Showtime not found');
      }

      const bookings = await Booking.find({ showtime: id }).session(session);
      for (const booking of bookings) {
        await Ticket.deleteMany({ booking: booking._id }).session(session);
      }

      await Booking.deleteMany({ showtime: id }).session(session);
      await Showtime.findByIdAndDelete(id).session(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  findShowtimesForTheater: async (movieId, theaterId, date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return Showtime.find({
      movie: movieId,
      theater: theaterId,
      startTime: { $gte: startOfDay, $lte: endOfDay }
    }).select('startTime endTime');
  },

  findSeatsByShowtimeId: async (showtimeId) => {
    return Showtime.find({ _id: showtimeId });
  }
};

export default showtimeRepository;