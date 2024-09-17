const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie-controller')
const theaterController=require('../controllers/theater-controller')
const { uploadMovieFiles } = require('../middlewares/upload')
const showtimeController = require('../controllers/showtime-controller');
const userController=require('../controllers/user-controller')
const ticketCOntroller=require('../controllers/ticket-controller');
const dashboardController=require('../controllers/dashboard-controller')
const authController=require('../controllers/auth-controller');
const theater = require('../models/theater');

// login route
router.post('/login',authController.adminLogin)
router.get('/logout',authController.adminLogout) 
router.get('/check-auth',authController.checkAuth)
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
router.get('/get-theater-by-id/:id',theaterController.getTheaterById)  
router.put('/update-theater/:id',theaterController.update)
router.delete('/delete-theater/:id',theaterController.deleteTheater)
// users route 
router.get('/users',userController.getUsers) 
router.get('/dashboard', dashboardController.getDashboardData);

// tickets
router.get('/tickets',ticketCOntroller.getAllTickets)

// show time routes 
router.post('/add-showtime',showtimeController.addShowTime)
router.get('/showtimes',showtimeController.getAllShowtimes)
router.get('/showtimes/:id',showtimeController.getShowtimeById)
router.put('/showtimes/:id',showtimeController.updateShowtime)
router.delete('/showtimes/:id', showtimeController.deleteShowtime);
router.get('/showtimes-check',showtimeController.showtimesForTheater)

module.exports = router;    