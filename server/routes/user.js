import express from 'express';
import MovieController from '../controllers/movie-controller.js';
import AuthController from '../controllers/auth-controller.js';
import ShowtimeController from '../controllers/showtime-controller.js';
import PaymentController from '../controllers/payment-controller.js';
import TicketController from '../controllers/ticket-controller.js';
import { verifyUser } from '../middlewares/authorization.js';
import authController from '../controllers/auth-controller.js';

const router = express.Router();

// auth routes 
router.post('/auth/google-callback', AuthController.googleCallback);
router.post('/auth/verify-otp', AuthController.verifyEmailOTP);
router.get('/logout', AuthController.logout);
router.post('/auth/resend-otp',AuthController.resendOTP)

// movie routes
router.get('/movies', MovieController.getAllMovies);
router.get('/movie/:id', MovieController.getMovieById);
router.get('/search-movies', MovieController.searchMovies);

// reviews 
router.post('/movie/:id/review', MovieController.addReview);

// booking - show times
router.get('/showtimes/:id', ShowtimeController.getMovieShowtimes);
router.get('/seats/:showtimeId', ShowtimeController.seatsByshowtimeId);

// payment 
router.post('/create-order', verifyUser, PaymentController.createOrder);
router.post('/verify-order', verifyUser, PaymentController.verifyOrder);

// confirmation
router.get('/get-ticket/:id', verifyUser, TicketController.getTicket);
router.post('/send-whatsapp', verifyUser, TicketController.sendTicket);

router.get('/tickets', verifyUser, TicketController.getAllTicketsByUserId);

export default router;