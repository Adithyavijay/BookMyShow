const movieRepository = require('../repositories/movie-repository')
const path = require('path');
const fs = require('fs').promises;
const mongoose = require('mongoose');
const movie = require('../models/movie');

exports.addMovie = async (req, res) => {
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
    res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ message: 'Error adding movie', error: error.message });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await movieRepository.findAll()
    
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
};

exports.getMovieById = async (req, res) => { 

  const id = req.params.movieId || req.params.id;


  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid id format' });
  }

  try {
    const movie = await movieRepository.findById(id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found in database' });
    }
    console.log(movie)
    res.status(200).json(movie);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateMovie = async (req, res) => {
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

    let movie = await movieRepository.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
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
    res.status(200).json({ message: 'Movie updated successfully', movie: updatedMovie });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Error updating movie', error: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  const id = req.params.movieId;

  try {
    const movie = await movieRepository.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
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

    // Delete the movie from the database
    await movieRepository.delete(id);

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: "Error deleting movie", error: error.message });
  }
};