const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie-controller')
const theaterController=require('../controllers/theater-controller')
const { uploadMovieFiles } = require('../middlewares/upload')
const authController= require('../controllers/auth-controller')
const showtimeController = require('../controllers/showtime-controller');

// movies routes

router.post('/movies', uploadMovieFiles, movieController.addMovie);
router.get('/movies', movieController.getAllMovies);
// get movie by id
router.get('/movies/:movieId',movieController.getMovieById) 

// update movie 
router.put('/update-movies/:movieId',uploadMovieFiles,movieController.updateMovie)  

// delete movie 
router.delete('/delete-movie/:movieId',movieController.deleteMovie)


// theater routes
router.post('/upload-theater',theaterController.addTheater) 
router.get('/get-theaters',theaterController.getTheaters)
router.get('/get-theater-by-id',theaterController.getTheaterById) 

// auth routes 
router.post('/auth/google-callback',authController.googleCallback)
router.post('/auth/verify-otp',authController.verifyEmailOTP)

// show time routes 
router.post('/add-showtime',showtimeController.addShowTime)
router.get('/showtimes',showtimeController.getAllShowtimes)

module.exports = router;    