// repositories/showtime-repository.js

import Showtime from '../models/showtime.js';
import Booking from '../models/booking.js';
import Ticket from '../models/ticket.js';
import mongoose from 'mongoose';
import { formatShowtime } from '../responses/showtime-response.js';

/**
 * Repository for handling Showtime-related database operations
 */
const showtimeRepository = {
  /**
   * @desc Create a new showtime
   * @param {Object} showtimeData - The data for the new showtime
   * @returns {Promise<Object>} The created showtime object with populated movie and theater
   */
  create: async (showtimeData) => {
    const newShowtime = new Showtime(showtimeData);
    newShowtime.initializeSeats();
  
    await newShowtime.save();
    return Showtime.findById(newShowtime._id)
      .populate('movie', 'title')
      .populate('theater', 'name');
  },

  /**
   * @desc Retrieve all showtimes
   * @returns {Promise<Array>} Array of all showtime objects with populated movie and theater
   */
  findAll: async () => {
    return Showtime.find()
      .populate('movie', 'title')
      .populate('theater', 'name');
  },

  /**
   * @desc Find showtimes for a specific movie
   * @param {string} movieId - The ID of the movie
   * @returns {Promise<Array>} Array of showtime objects for the specified movie
   */
  findByMovie: async (movieId) => {
    return Showtime.find({ movie: movieId })
      .populate('movie', 'title language genre certificate')
      .populate('theater', 'name location');
  },
  /** 
   * @desc Find a showtime by its ID
   * @param {string} id - The ID of the showtime
   * @returns {Promise<Object|null>} The showtime object if found, null otherwise
   */
  findById: async (id) => { 
    return Showtime.findById(id)
      .populate('movie', 'title theaters duration')
      .populate('theater', 'name');
  },

  /**
   * @desc Update a showtime
   * @param {string} id - The ID of the showtime to update
   * @param {Object} updateData - The data to update the showtime with
   * @returns {Promise<Object|null>} The updated showtime object if found, null otherwise
   */
  update: async (id, updateData) => {
    return Showtime.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('movie')
      .populate('theater');
  },

  /**
   * @desc Delete a showtime and related bookings and tickets
   * @param {string} id - The ID of the showtime to delete
   * @throws {Error} If the showtime is not found or if there's an error during deletion
   */
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

  /**
   * @desc Find showtimes for a specific movie in a specific theater on a given date
   * @param {string} movieId - The ID of the movie
   * @param {string} theaterId - The ID of the theater
   * @param {Date} date - The date to find showtimes for
   * @returns {Promise<Array>} Array of showtime objects matching the criteria
   */
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

  /**
   * @desc Find seats for a specific showtime
   * @param {string} showtimeId - The ID of the showtime
   * @returns {Promise<Array>} Array of seat objects for the specified showtime
   */
  findSeatsByShowtimeId: async (showtimeId) => {
    return Showtime.findOne({ _id: showtimeId });
  }
};

export default showtimeRepository;