const express = require('express');
const router = express.Router();
const movieController= require('../controllers/movie-controller')
const showtimeController= require('../controllers/showtime-controller')
const paymentController= require('../controllers/payment-controller')
const ticketController= require('../controllers/ticket-controller')
const { verifyUser}= require('../middlewares/authorization')
// const {verifyUser}=require('../middlewares/authorization')


router.get('/movies',movieController.getAllMovies) ;
router.get('/movie/:id',movieController.getMovieById); 

// booking - show times 

router.get('/showtimes/:id',verifyUser,showtimeController.getMovieShowtimes)
router.get('/seats/:showtimeId',verifyUser,showtimeController.seatsByshowtimeId) 

// payment 
router.post('/create-order',verifyUser,paymentController.createOrder);
router.post('/verify-order', verifyUser,paymentController.verifyOrder);

// confirmation 

router.get('/get-ticket/:id',verifyUser, ticketController.getTicket)
router.post('/send-whatsapp',verifyUser,ticketController.sendTicket )

module.exports = router;