// paymentRepository.js
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../models/booking.js';
import Showtime from '../models/showtime.js';
import User from '../models/user.js';
import Ticket from '../models/ticket.js';
import qrcode from 'qrcode';
import dotenv from 'dotenv';

dotenv.config();

class PaymentRepository {
    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }

    async createOrder(amount) {
        const options = {
            amount,
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        };
        return await this.razorpay.orders.create(options);
    }

    verifySignature(orderId, paymentId, signature) {
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");
        return generated_signature === signature;
    }

    async findShowtime(showtimeId) {
        return await Showtime.findById(showtimeId)
            .populate('movie', 'title')
            .populate('theater', 'name');
    }

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

    async updateUserBookings(userId, bookingId) {
        return await User.findByIdAndUpdate(userId, {
            $push: { bookings: bookingId },
        });
    }
}

const paymentRepository = new PaymentRepository();

export default paymentRepository;