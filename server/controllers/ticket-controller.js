const twilio=require('twilio');
const Ticket= require('../models/ticket')
const fs = require('fs').promises;
const path = require('path');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.getTicket= async(req,res)=>{
    try{
        const id = req.params.id;
        const ticket= await Ticket.findById(id);
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        console.log(ticket);
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
        let mediaUrl;
        if (ticket.qrCode.startsWith('http')) {
            // If qrCode is already a URL, use it directly
            mediaUrl = ticket.qrCode;
        } else if (ticket.qrCode.startsWith('data:image')) {
            // If qrCode is a data URI, it's already in the correct format
            mediaUrl = ticket.qrCode;
        } else {
            // If qrCode is a base64 string without the data URI prefix, add it
            mediaUrl = `data:image/png;base64,${ticket.qrCode}`;
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
            mediaUrl: [mediaUrl]
        });

        // Delete the temporary file
        await fs.unlink(qrCodePath);

        res.status(200).json({ message: 'WhatsApp message sent successfully with QR code' });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        res.status(500).json({ message: 'Failed to send WhatsApp message' });
    }
};