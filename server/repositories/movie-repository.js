const Movie = require('../models/movie')

class MovieRepository {
    async findById(id) {
        return await Movie.findById(id);
    }

    async create(movieData) {
        const movie = new Movie(movieData);
        return await movie.save();
    }

    async update(id, updateData) {
        return await Movie.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await Movie.findByIdAndDelete(id);
    }
    async findAll() {
        return await Movie.find().populate('theaters','name');
    }
}
module.exports = new MovieRepository();
