const twilio=require('twilio');
const Ticket= require('../models/ticket');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

exports.getTicket= async(req,res)=>{
    try{
        const id = req.params.id;
        const ticket= await Ticket.findById(id);
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(ticket);
    }catch(err){
        console.error('Error fetching ticket:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.sendTicket = async (req, res) => {
    try {
      
        const { ticketId, whatsappNumber } = req.body;

        // Validate WhatsApp number
        if (!whatsappNumber || !whatsappNumber.match(/^\+[1-9]\d{1,14}$/)) {
            return res.status(400).json({ message: 'Invalid WhatsApp number' });
        }

        // Fetch ticket details
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Ensure the QR code is a valid base64 string
        let qrCodeUrl;
        if (ticket.qrCode.startsWith('http')) {
            // If qrCode is already a URL, use it directly
            qrCodeUrl = ticket.qrCode;
        } else {
            // Upload QR code to Cloudinary
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload(
                    ticket.qrCode, // This is already in data:image format
                    { 
                        folder: 'ticket_qr_codes',
                        public_id: `qr_${ticketId}_${Date.now()}` // Unique identifier for the image
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
            });
            qrCodeUrl = result.secure_url;

        }

        // Compose message
        const message = `
🎬 Booking Confirmed!

Movie: ${ticket.movieName}
Theater: ${ticket.theaterName}
Date: ${ticket.showDateTime.toLocaleDateString()}
Time: ${ticket.showDateTime.toLocaleTimeString()}
Seats: ${ticket.seats.join(', ')}

Please show the QR code below at the theater entrance.
Enjoy your movie! 🍿
        `;

        // Send WhatsApp message with QR code
        await client.messages.create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${whatsappNumber}`,
            mediaUrl: [qrCodeUrl]
        }); 
     

    
        res.status(200).json({ message: 'WhatsApp message sent successfully with QR code' });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        res.status(500).json({ message: 'Failed to send WhatsApp message' });
    }
}; 

exports.getAllTickets = async (req, res) => { 
    
    try {
      const tickets = await Ticket.find()
        .populate('user', 'username email')
        .populate('showtime', 'startTime')
        .sort({ createdAt: -1 }); 
      
  
      res.status(200).json(tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }; 

  exports.getAllTicketsByUserId = async(req,res)=>{
    try {
        const userId = req.user.    id; // Assuming you have user authentication middleware
        
        const tickets = await Ticket.find({ user: userId })
          .sort({ showDateTime: -1 }) // Sort by showtime, most recent first
          .select('movieName theaterName showDateTime seats status qrCode');
        res.status(200).json(tickets);
      } catch (error) {
        console.error('Error fetching user tickets:', error);
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
      }
    
  }