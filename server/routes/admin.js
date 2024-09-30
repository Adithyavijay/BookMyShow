import express from 'express';
import MovieController from '../controllers/movie-controller.js';
import TheaterController from '../controllers/theater-controller.js';
import ShowtimeController from '../controllers/showtime-controller.js';
import UserController from '../controllers/user-controller.js';
import TicketController from '../controllers/ticket-controller.js';
import DashboardController from '../controllers/dashboard-controller.js';
import AuthController from '../controllers/auth-controller.js';
import { uploadMovieFiles } from '../middlewares/upload.js';
import { verifyAdmin } from '../middlewares/authorization.js';

const router = express.Router();

// login routes
router.post('/login', AuthController.adminLogin);
router.get('/logout',verifyAdmin, AuthController.adminLogout);
router.get('/check-auth', AuthController.checkAuth);
router.get('/validate-token',AuthController.validateAdminToken)

// movies routes
router.post('/movies', verifyAdmin, uploadMovieFiles, MovieController.addMovie);
router.get('/movies',verifyAdmin, MovieController.getAllMovies);
router.get('/movies/:movieId', MovieController.getMovieById);
router.put('/update-movies/:movieId', uploadMovieFiles, MovieController.updateMovie);
router.delete('/delete-movie/:movieId', MovieController.deleteMovie);

// theater routes
router.post('/upload-theater',verifyAdmin, TheaterController.addTheater);
router.get('/get-theaters',verifyAdmin, TheaterController.getTheaters);
router.get('/get-theater-by-id/:id',verifyAdmin, TheaterController.getTheaterById);
router.put('/update-theater/:id', verifyAdmin,TheaterController.update);
router.delete('/delete-theater/:id',verifyAdmin, TheaterController.deleteTheater);

// users route
router.get('/users',verifyAdmin, UserController.getUsers);

// dashboard route
router.get('/dashboard',verifyAdmin, DashboardController.getDashboardData);

// tickets route
router.get('/tickets', TicketController.getAllTickets);

// show time routes
router.post('/add-showtime',verifyAdmin, ShowtimeController.addShowTime);
router.get('/showtimes',verifyAdmin, ShowtimeController.getAllShowtimes);
router.get('/showtimes/:id',verifyAdmin, ShowtimeController.getShowtimeById);
router.put('/showtimes/:id',verifyAdmin, ShowtimeController.updateShowtime);
router.delete('/showtimes/:id',verifyAdmin, ShowtimeController.deleteShowtime);
router.get('/showtimes-check', verifyAdmin,ShowtimeController.showtimesForTheater);

export default router;