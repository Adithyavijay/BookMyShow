import movieRepository from '../repositories/movie-repository.js';
import path from 'path';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import Movie from '../models/movie.js';
import User from '../models/user.js';
import Showtime from '../models/showtime.js';
import Ticket from '../models/ticket.js';
import { formatMovie } from '../responses/movie-response.js';

const __dirname = path.resolve();

const movieController = {
  /**
   * @desc    Add a new movie
   * @route   POST /api/movies
   * @access  Private/Admin
   * @param   {Object} req - Express request object
   * @param   {Object} res - Express response object
   * @returns {Object} JSON object with message and new movie data
   */
  async addMovie(req, res) {
    try {
      const {
        title,
        description,
        duration,
        genre,
        language,
        releaseDate,
        certificate,
        director,
        castNames,
        theaters
      } = req.body;

      const parsedCastNames = JSON.parse(castNames);
      const parsedTheaters = JSON.parse(theaters);

      const posterFile = req.files['poster'] ? '/uploads/' + req.files['poster'][0].filename : null;
      const photoFiles = req.files['photos']
        ? req.files['photos'].map(file => '/uploads/' + file.filename)
        : [];

      const cast = parsedCastNames.map((name, index) => ({
        castName: name,
        castPhoto: req.files[`castPhoto${index}`] ? '/uploads/' + req.files[`castPhoto${index}`][0].filename : null
      }));

      const movieData = {
        title,
        description,
        duration,
        genre,
        language,
        releaseDate,
        cast,
        director,
        certificate,
        theaters: parsedTheaters,
        poster: posterFile,
        photos: photoFiles
      };

      const newMovie = await movieRepository.create(movieData);
      res.status(201).json({ status: true, message: 'Movie added successfully', data: formatMovie(newMovie) });
    } catch (error) {
      console.error('Error adding movie:', error);
      res.status(500).json({status:true, message: 'Error adding movie', error: error.message });
    }
  },

  /**
   * @desc    Get all movies
   * @route   GET /api/movies
   * @access  Public
   * @param   {Object} req - Express request object
   * @param   {Object} res - Express response object
   * @returns {Object} JSON object with all movies
   */
  async getAllMovies(req, res) { 
    console.log('sdafsf')
    try {
      const movies = await movieRepository.findAll();
      const formattedMovies= movies.map(movie=>formatMovie(movie))
      res.json({status:true,message : "Movies fetched successfully",data : formattedMovies});
    } catch (error) {
      res.status(500).json({status:true, message: 'Error fetching movies', error: error.message });
    }
  },

  /**
   * @desc    Get a movie by ID
   * @route   GET /api/movies/:id
   * @access  Public
   * @param   {Object} req - Express request object
   * @param   {Object} res - Express response object
   * @returns {Object} JSON object with movie data
   */
  async getMovieById(req, res) {
    const id = req.params.movieId || req.params.id;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ status:false,message: 'Invalid id format' });
    }

    try {
      const movie = await movieRepository.findById(id);

      if (!movie) {
        return res.status(404).json({status:false, message: 'Movie not found in database' });
      }
      res.status(200).json({status : true ,message :"Movie fetched successfully",data : formatMovie(movie)});
    } catch (err) {
      console.log(err);
      res.status(500).json({status:false, message: "Server error", error: err.message });
    }
  },

  /**
   * @desc    Update a movie
   * @route   PUT /api/movies/:id
   * @access  Private/Admin
   * @param   {Object} req - Express request object
   * @param   {Object} res - Express response object
   * @returns {Object} JSON object with message and updated movie data
   */
  async updateMovie(req, res) {
    try {
      const id = req.params.movieId;
      const {
        title,
        description,
        duration,
        genre,
        language,
        releaseDate,
        certificate,
        director,
        theaters,
        castNames
      } = req.body;
      console.log('theaters',theaters)
      let movie = await movieRepository.findById(id);
      if (!movie) {
        return res.status(404).json({ status:false,message: 'Movie not found' });
      }

      let posterFile = movie.poster;
      if (req.files && req.files['poster']) {
        posterFile = '/uploads/' + req.files['poster'][0].filename;
      }

      let photoFiles = movie.photos;
      if (req.files && req.files['photos']) {
        photoFiles = req.files['photos'].map(file => '/uploads/' + file.filename);
      }

      const parsedCastNames = JSON.parse(castNames);
      const updatedCast = parsedCastNames.map((name, index) => ({
        castName: name,
        castPhoto: req.files[`castPhoto${index}`]
          ? '/uploads/' + req.files[`castPhoto${index}`][0].filename
          : movie.cast[index] ? movie.cast[index].castPhoto : null
      }));

      const parsedTheaters = JSON.parse(theaters);
      const updatedTheaters = theaters ? parsedTheaters.map(id => new mongoose.Types.ObjectId(id)) : movie.theaters;

      const updateData = {
        title: title || movie.title,
        description: description || movie.description,
        duration: duration || movie.duration,
        genre: genre || movie.genre,
        language: language || movie.language,
        releaseDate: releaseDate || movie.releaseDate,
        certificate: certificate || movie.certificate,
        director: director || movie.director,
        theaters: updatedTheaters,
        cast: updatedCast,
        poster: posterFile,
        photos: photoFiles
      };

      const updatedMovie = await movieRepository.update(id, updateData);
      res.status(200).json({status:true, message: 'Movie updated successfully', data: formatMovie(updatedMovie) });
    } catch (error) {
      console.error('Error updating movie:', error);
      res.status(500).json({ status:false, message: 'Error updating movie', error: error.message });
    }
  },

  /**
   * @desc    Delete a movie and associated data
   * @route   DELETE /api/movies/:id
   * @access  Private/Admin
   * @param   {Object} req - Express request object
   * @param   {Object} res - Express response object
   * @returns {Object} JSON object with success message
   */
  async deleteMovie(req, res) {
    const id = req.params.movieId;

    try {
      const movie = await Movie.findById(id);
      if (!movie) {
        return res.status(404).json({status:false, message: "Movie not found" });
      }

      // Delete associated files (poster and photos)
      if (movie.poster) {
        const posterPath = path.join(__dirname, '..', 'public', movie.poster);
        try {
          await fs.unlink(posterPath);
        } catch (err) {
          console.error('Error deleting poster:', err);
        }
      }

      if (movie.photos && movie.photos.length > 0) {
        for (const photo of movie.photos) {
          const photoPath = path.join(__dirname, '..', 'public', photo);
          try {
            await fs.unlink(photoPath);
          } catch (err) {
            console.error('Error deleting photo:', err);
          }
        }
      }

      if (movie.cast && movie.cast.length > 0) {
        for (let i = 0; i < movie.cast.length; i++) {
          if (movie.cast[i].castPhoto) {
            const castPhotoPath = path.join(__dirname, '..', 'public', movie.cast[i].castPhoto);
            try {
              await fs.unlink(castPhotoPath);
            } catch (err) {
              console.error('Error deleting cast photo:', err);
            }
          }
        }
      }

      // Find and delete associated showtimes
      const showtimes = await Showtime.find({ movie: id });
      for (const showtime of showtimes) {
        // Delete tickets associated with this showtime
        await Ticket.deleteMany({ showtime: showtime._id });
        // Delete the showtime
        await Showtime.findByIdAndDelete(showtime._id);
      }

      // Delete the movie from the database
      await Movie.findByIdAndDelete(id);

      res.status(200).json({ status:true, message: "Movie and associated data deleted successfully" });
    } catch (error) {
      console.error('Error deleting movie:', error);
      res.status(500).json({ status:true , message: "Error deleting movie and associated data", error: error.message });
    }
  },  

  /**
   * @desc    Search for movies
   * @route   GET /api/movies/search
   * @access  Public
   * @param   {Object} req - Express request object
   * @param   {Object} res - Express response object
   * @returns {Object} JSON object with found movies
   */
  async searchMovies(req,res){
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ status:false,message: 'Search query is required' });
      }
  
      const movies = await Movie.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { genre: { $regex: query, $options: 'i' } },
        ]
      }).limit(10);

      const formattedMovies= movies.map(movie=>formatMovie(movie))  
      res.status(200).json({status : true , message : 'Movies fetched successfully',data : formattedMovies}); 
    } catch (error) {
      console.error('Error searching movies:', error);
      res.status(500).json({status:false, message: 'Internal server error',error :error.message });
    }
  },

  /**
   * @desc    Add or update a review and rating for a movie
   * @route   POST /api/movies/:id/reviews
   * @access  Private
   * @param   {Object} req - Express request object
   * @param   {Object} res - Express response object
   * @returns {Object} JSON object with message and updated movie data
   */
  async addReview(req, res) {
    const { id } = req.params; // Movie ID
    const { text, rating, userId } = req.body;

    try {
      // Find the movie
      const movie = await movieRepository.findById(id);
      if (!movie) {
        return res.status(404).json({status:false, message: 'Movie not found' });
      }

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({status:false, message: 'User not found' });
      }

      // Check if user has already reviewed this movie
      const existingReviewIndex = movie.reviews.findIndex(review => review.user.toString() === userId);
      const existingRatingIndex = movie.ratings.findIndex(rating => rating.user.toString() === userId);

      if (existingReviewIndex !== -1) {
        // Update existing review
        movie.reviews[existingReviewIndex].text = text;
        movie.reviews[existingReviewIndex].date = new Date();
      } else {
        // Add new review
        movie.reviews.push({
          user: userId,
          text: text,
          date: new Date()
        });
      }

      if (existingRatingIndex !== -1) {
        // Update existing rating
        movie.ratings[existingRatingIndex].value = rating;
      } else {
        // Add new rating
        movie.ratings.push({
          user: userId,
          value: rating
        });
      }

      // Recalculate average rating
      const totalRating = movie.ratings.reduce((sum, rating) => sum + rating.value, 0);
      movie.averageRating = totalRating / movie.ratings.length;

      // Save the updated movie
      await movie.save();

      res.status(200).json({ status:true,message: 'Review added successfully',data : formatMovie(movie)});
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({status:true, message: 'Error adding review', error: error.message });
    }
  }
};

export default movieController; 
