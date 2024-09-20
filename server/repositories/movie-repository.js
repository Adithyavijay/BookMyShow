import Movie from '../models/movie.js'

/**
 * Repository class for handling movie-related database operations
 */
class MovieRepository {
    /**
     * @desc Find a movie by its ID and populate related user data
     * @param {string} id - The ID of the movie to find
     * @returns {Promise<Object|null>} The movie object if found, null otherwise
     */
    async findById(id) {
        return await Movie.findById(id)
            .populate({
                path: 'reviews.user',
                select: 'username profilePicture'
            })
            .populate({
                path: 'ratings.user',
                select: 'username'
            });
    }

    /**
     * @desc Create a new movie in the database
     * @param {Object} movieData - The movie data to be saved
     * @returns {Promise<Object>} The saved movie object
     */
    async create(movieData) {
        const movie = new Movie(movieData);
        return await movie.save();
    }

    /**
     * @desc Update a movie's information
     * @param {string} id - The ID of the movie to update
     * @param {Object} updateData - The data to update the movie with
     * @returns {Promise<Object|null>} The updated movie object if found, null otherwise
     */
    async update(id, updateData) {
        return await Movie.findByIdAndUpdate(id, updateData, { new: true });
    }

    /**
     * @desc Delete a movie from the database
     * @param {string} id - The ID of the movie to delete
     * @returns {Promise<Object|null>} The deleted movie object if found, null otherwise
     */
    async delete(id) {
        return await Movie.findByIdAndDelete(id);
    }

    /**
     * @desc Retrieve all movies from the database with populated theater names
     * @returns {Promise<Array>} An array of all movie objects with populated theater names
     */
    async findAll() {
        return await Movie.find().populate('theaters', 'name');
    }
}

export default new MovieRepository();