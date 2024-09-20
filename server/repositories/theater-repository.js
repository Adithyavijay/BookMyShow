// theaterRepository.js

import Theater from '../models/theater.js';
import Showtime from '../models/showtime.js';
import Ticket from '../models/ticket.js';
import Movie from '../models/movie.js';

/**
 * Repository class for handling theater-related database operations
 */
class TheaterRepository {
  /**
   * @desc Create a new theater
   * @param {Object} theaterData - The data for the new theater
   * @returns {Promise<Object>} The created theater object
   */
  async create(theaterData) {
    return await Theater.create(theaterData);
  }

  /**
   * @desc Retrieve all theaters
   * @returns {Promise<Array>} Array of all theater objects
   */
  async findAll() {
    return await Theater.find();
  }

  /**
   * @desc Find a theater by its ID
   * @param {string} id - The ID of the theater
   * @returns {Promise<Object|null>} The theater object if found, null otherwise
   */
  async findById(id) {
    return await Theater.findById(id);
  }

  /**
   * @desc Update a theater's information
   * @param {string} id - The ID of the theater to update
   * @param {Object} updateData - The data to update the theater with
   * @returns {Promise<Object|null>} The updated theater object if found, null otherwise
   */
  async update(id, updateData) {
    return await Theater.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  /**
   * @desc Delete a theater and all related data (showtimes, tickets, and references in movies)
   * @param {string} id - The ID of the theater to delete
   * @throws {Error} If the theater is not found or if there's an error during deletion
   */
  async delete(id) {
    const session = await Theater.startSession();
    session.startTransaction();

    try {
      // Find the theater
      const theater = await Theater.findById(id).session(session);
      if (!theater) {
        throw new Error('Theater not found');
      }

      // Find all showtimes for this theater
      const showtimes = await Showtime.find({ theater: id }).session(session);

      // Delete all tickets associated with these showtimes
      for (const showtime of showtimes) {
        await Ticket.deleteMany({ showtime: showtime._id }).session(session);
      }

      // Delete all showtimes for this theater
      await Showtime.deleteMany({ theater: id }).session(session);

      // Remove this theater from all movies that reference it
      await Movie.updateMany(
        { theaters: id },
        { $pull: { theaters: id } }
      ).session(session);

      // Finally, delete the theater
      await Theater.findByIdAndDelete(id).session(session);

      // If all operations are successful, commit the transaction
      await session.commitTransaction();
    } catch (error) {
      // If any operation fails, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
  }
}

export default new TheaterRepository();