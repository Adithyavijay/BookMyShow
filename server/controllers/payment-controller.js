// paymentController.js

import paymentRepository from "../repositories/payment-repository.js";

/**
 * Controller for handling payment-related operations
 */
class PaymentController {
    /**
     * @desc Creates a new order for payment
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body
     * @param {number} req.body.amount - Amount for the order
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with order ID
     */
    async createOrder(req, res) {
        try {
            const order = await paymentRepository.createOrder(req.body.amount);
            res.json({
                status: true,
                message: "order id fetched successfully",
                orderId: order.id,
            });
        } catch (error) {
            console.error("Error creating order:", error);
            res.status(500).json({
                status: false,
                error: "Error creating order",
            });
        }
    }

    /**
     * @desc Verifies the payment order and creates a booking and ticket
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body
     * @param {string} req.body.razorpay_order_id - Razorpay order ID
     * @param {string} req.body.razorpay_payment_id - Razorpay payment ID
     * @param {string} req.body.razorpay_signature - Razorpay signature
     * @param {string} req.body.showtimeId - ID of the showtime
     * @param {Array} req.body.seats - Array of selected seats
     * @param {Object} req.user - User object from authentication middleware
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with success status and ticket ID
     */
    async verifyOrder(req, res) {
        try {
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                showtimeId,
                seats,
            } = req.body;

            // Verify the Razorpay signature
            const isValid = paymentRepository.verifySignature(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            );

            if (isValid) {
                // Find the showtime
                const showtime = await paymentRepository.findShowtime(
                    showtimeId
                );

                if (!showtime) {
                    return res.status(404).json({
                        success: false,
                        error: "Showtime not found",
                    });
                }

                // Update showtime with booked seats
                await paymentRepository.updateShowtime(showtime, seats);

                // Calculate total price
                const totalPrice = seats.length * showtime.price;

                // Create booking
                const booking = await paymentRepository.createBooking(
                    req.user.id,
                    showtimeId,
                    seats,
                    totalPrice
                );

                // Create ticket
                const ticket = await paymentRepository.createTicket(
                    booking,
                    req.user.id,
                    showtimeId,
                    showtime.movie.title,
                    showtime.theater.name,
                    showtime.startTime,
                    seats
                );

                // Update user's bookings
                await paymentRepository.updateUserBookings(
                    req.user.id,
                    booking._id
                );

                res.json({ success: true, ticketId: ticket._id });
            } else {
                res.status(400).json({
                    success: false,
                    error: "Invalid signature",
                });
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            res.status(500).json({
                success: false,
                error: "Error verifying payment",
            });
        }
    }
}

const paymentController = new PaymentController();

export default paymentController;
