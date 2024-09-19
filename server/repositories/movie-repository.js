import Movie from '../models/movie.js'
class MovieRepository {
    async findById(id) {
        return await Movie.findById(id) .populate({
            path: 'reviews.user',
            select: 'username profilePicture'
        })
        .populate({
            path: 'ratings.user',
            select: 'username'
        });
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

export default new MovieRepository();
