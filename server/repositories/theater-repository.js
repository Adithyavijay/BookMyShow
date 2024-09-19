// theaterRepository.js

import Theater from '../models/theater.js';
import Showtime from '../models/showtime.js';
import Ticket from '../models/ticket.js';
import Movie from '../models/movie.js';

class TheaterRepository {
  async create(theaterData) {
    return await Theater.create(theaterData);
  }

  async findAll() {
    return await Theater.find();
  }

  async findById(id) {
    return await Theater.findById(id);
  }

  async update(id, updateData) {
    return await Theater.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async delete(id) {
    const session = await Theater.startSession();
    session.startTransaction();

    try {
      const theater = await Theater.findById(id).session(session);
      if (!theater) {
        throw new Error('Theater not found');
      }

      const showtimes = await Showtime.find({ theater: id }).session(session);

      for (const showtime of showtimes) {
        await Ticket.deleteMany({ showtime: showtime._id }).session(session);
      }

      await Showtime.deleteMany({ theater: id }).session(session);

      await Movie.updateMany(
        { theaters: id },
        { $pull: { theaters: id } }
      ).session(session);

      await Theater.findByIdAndDelete(id).session(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export default new TheaterRepository();