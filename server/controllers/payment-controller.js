const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/booking");
const Showtime = require("../models/showtime");
const User = require("../models/user");
const Ticket=require('../models/ticket');
const qrcode= require('qrcode');
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  
    try {
        const options = {
            amount: req.body.amount,
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);
        res.json({ orderId: order.id });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Error creating order" });
    }
};

exports.verifyOrder = async (req, res) => {
    
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            showtimeId,
            seats,
        } = req.body;


        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            const showtime = await Showtime.findById(showtimeId)
            .populate('movie', 'title')
            .populate('theater', 'name');


            if (!showtime) {
                res.status(404).json({
                    success: false,
                    error: "showtime not find",
                });
            }

            // Update the seats in the showtime
            seats.forEach((seatNumber) => {
                const seatIndex = showtime.seats.findIndex(
                    (seat) => seat.seatNumber === seatNumber
                );
                if (seatIndex !== -1) {
                    showtime.seats[seatIndex].isBooked = true;
                }
            });

            // Update available seats count
            await  showtime.updateAvailableSeats();

            // Save the updated showtime
            await showtime.save();


            const totalPrice = seats.length * showtime.price ;

            // Payment is succes  sful, update the database
            const booking = new Booking({
              user: req.user.id, //from auth middleware
              showtime: showtimeId,
              seats: seats, // Array of seat numbers
              totalPrice: totalPrice,
              status: 'confirmed'
            }); 

            await booking.save();

             // Create a single ticket for all seats
             const qrCodeData = `${booking._id}-${showtimeId}-${seats.join(',')}`;
             const qrCodeImage = await qrcode.toDataURL(qrCodeData);
 
              const ticket = new Ticket({
                booking: booking._id,
                user: req.user.id,
                showtime: showtimeId,
                movieName: showtime.movie.title,
                theaterName: showtime.theater.name,
                showDateTime: showtime.startTime,
                seats: seats,
                qrCode: qrCodeImage
            });
 
             await ticket.save();


            // Update user's bookings
            await User.findByIdAndUpdate(req.user.id, {
                $push: { bookings: booking._id },
            });

            res.json({ success: true, ticketId: ticket._id});
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
};
