// paymentRepository.js
import Booking from '../models/booking.js';
import Showtime from '../models/showtime.js';
import User from '../models/user.js';
import Ticket from '../models/ticket.js';
import qrcode from 'qrcode';
import razorpayUtil from '../utils/razorpay-utils.js';

/**
 * Repository class for handling payment and booking related operations
 */
class PaymentRepository {
    /**
     * @desc Create a new Razorpay order
     * @param {number} amount - The amount for the order in paise
     * @returns {Promise<Object>} The created Razorpay order object
     */
    async createOrder(amount) {
        return await razorpayUtil.createOrder(amount);
    }

    /**
     * @desc Verify the Razorpay signature
     * @param {string} orderId - The Razorpay order ID
     * @param {string} paymentId - The Razorpay payment ID
     * @param {string} signature - The signature to verify
     * @returns {boolean} True if the signature is valid, false otherwise
     */
    verifySignature(orderId, paymentId, signature) {
        return razorpayUtil.verifySignature(orderId, paymentId, signature);
    }

    /**
     * @desc Find a showtime by ID and populate related movie and theater data
     * @param {string} showtimeId - The ID of the showtime to find
     * @returns {Promise<Object|null>} The showtime object if found, null otherwise
     */
    async findShowtime(showtimeId) {
        return await Showtime.findById(showtimeId)
            .populate('movie', 'title')
            .populate('theater', 'name');
    }

    /**
     * @desc Update showtime seats status and available seats count
     * @param {Object} showtime - The showtime object to update
     * @param {Array<string>} seats - Array of seat numbers to mark as booked
     * @returns {Promise<Object>} The updated showtime object
     */
    async updateShowtime(showtime, seats) {
        seats.forEach((seatNumber) => {
            const seatIndex = showtime.seats.findIndex(
                (seat) => seat.seatNumber === seatNumber
            );
            if (seatIndex !== -1) {
                showtime.seats[seatIndex].isBooked = true;
            }
        });
        await showtime.updateAvailableSeats();
        return await showtime.save();
    }

    /**
     * @desc Create a new booking
     * @param {string} userId - The ID of the user making the booking
     * @param {string} showtimeId - The ID of the showtime being booked
     * @param {Array<string>} seats - Array of seat numbers booked
     * @param {number} totalPrice - The total price of the booking
     * @returns {Promise<Object>} The created booking object
     */
    async createBooking(userId, showtimeId, seats, totalPrice) {
        const booking = new Booking({
            user: userId,
            showtime: showtimeId,
            seats,
            totalPrice,
            status: 'confirmed'
        });
        return await booking.save();
    }

    /**
     * @desc Create a new ticket with QR code
     * @param {Object} booking - The booking object
     * @param {string} userId - The ID of the user
     * @param {string} showtimeId - The ID of the showtime
     * @param {string} movieName - The name of the movie
     * @param {string} theaterName - The name of the theater
     * @param {Date} showDateTime - The date and time of the show
     * @param {Array<string>} seats - Array of seat numbers
     * @returns {Promise<Object>} The created ticket object
     */
    async createTicket(booking, userId, showtimeId, movieName, theaterName, showDateTime, seats) {
        const qrCodeData = `${booking._id}-${showtimeId}-${seats.join(',')}`;
        const qrCodeImage = await qrcode.toDataURL(qrCodeData);
        
        const ticket = new Ticket({
            booking: booking._id,
            user: userId,
            showtime: showtimeId,
            movieName,
            theaterName,
            showDateTime,
            seats,
            qrCode: qrCodeImage
        });
        return await ticket.save();
    }

    /**
     * @desc Update user's bookings array
     * @param {string} userId - The ID of the user
     * @param {string} bookingId - The ID of the booking to add
     * @returns {Promise<Object>} The updated user object
     */
    async updateUserBookings(userId, bookingId) {
        return await User.findByIdAndUpdate(userId, {
            $push: { bookings: bookingId },
        });
    }
}

export default new PaymentRepository();