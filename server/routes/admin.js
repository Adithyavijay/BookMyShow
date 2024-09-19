import express from 'express';
import MovieController from '../controllers/movie-controller.js';
import TheaterController from '../controllers/theater-controller.js';
import ShowtimeController from '../controllers/showtime-controller.js';
import UserController from '../controllers/user-controller.js';
import TicketController from '../controllers/ticket-controller.js';
import DashboardController from '../controllers/dashboard-controller.js';
import AuthController from '../controllers/auth-controller.js';
import { uploadMovieFiles } from '../middlewares/upload.js';

const router = express.Router();

// login routes
router.post('/login', AuthController.adminLogin);
router.get('/logout', AuthController.adminLogout);
router.get('/check-auth', AuthController.checkAuth);

// movies routes
router.post('/movies', uploadMovieFiles, MovieController.addMovie);
router.get('/movies', MovieController.getAllMovies);
router.get('/movies/:movieId', MovieController.getMovieById);
router.put('/update-movies/:movieId', uploadMovieFiles, MovieController.updateMovie);
router.delete('/delete-movie/:movieId', MovieController.deleteMovie);

// theater routes
router.post('/upload-theater', TheaterController.addTheater);
router.get('/get-theaters', TheaterController.getTheaters);
router.get('/get-theater-by-id/:id', TheaterController.getTheaterById);
router.put('/update-theater/:id', TheaterController.update);
router.delete('/delete-theater/:id', TheaterController.deleteTheater);

// users route
router.get('/users', UserController.getUsers);

// dashboard route
router.get('/dashboard', DashboardController.getDashboardData);

// tickets route
router.get('/tickets', TicketController.getAllTickets);

// show time routes
router.post('/add-showtime', ShowtimeController.addShowTime);
router.get('/showtimes', ShowtimeController.getAllShowtimes);
router.get('/showtimes/:id', ShowtimeController.getShowtimeById);
router.put('/showtimes/:id', ShowtimeController.updateShowtime);
router.delete('/showtimes/:id', ShowtimeController.deleteShowtime);
router.get('/showtimes-check', ShowtimeController.showtimesForTheater);

export default router;