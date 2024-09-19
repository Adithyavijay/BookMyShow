// ticketController.js
import dotenv from 'dotenv';
import ticketRepository from '../repositories/ticket-repository.js';
import twilioClient from '../config/twilio.js';
import cloudinary from '../config/cloudinary.js';

dotenv.config();

/**
 * Controller for handling ticket-related operations
 */
class TicketController {
  /**
   * @desc Retrieves a specific ticket by ID
   * @param {Object} req - Express request object
   * @param {string} req.params.id - Ticket ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with the specified ticket
   */
  async getTicket(req, res) {
    try {
      const id = req.params.id;
      const ticket = await ticketRepository.findById(id);
      
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.status(200).json(ticket);
    } catch (err) {
      console.error('Error fetching ticket:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * @desc Sends ticket information via WhatsApp
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.ticketId - Ticket ID
   * @param {string} req.body.whatsappNumber - WhatsApp number to send the ticket to
   * @param {Object} res - Express response object
   * @returns {Object} JSON response indicating success or failure of sending the ticket
   */
  async sendTicket(req, res) {
    try {
      const { ticketId, whatsappNumber } = req.body;

      if (!whatsappNumber || !whatsappNumber.match(/^\+[1-9]\d{1,14}$/)) {
        return res.status(400).json({ message: 'Invalid WhatsApp number' });
      }

      const ticket = await ticketRepository.findById(ticketId);

      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }

      // Generate or retrieve QR code URL
      let qrCodeUrl;
      if (ticket.qrCode.startsWith('http')) {
        qrCodeUrl = ticket.qrCode;
      } else {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            ticket.qrCode,
            { 
              folder: 'ticket_qr_codes',
              public_id: `qr_${ticketId}_${Date.now()}`
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
        });
        qrCodeUrl = result.secure_url;
      }

      // Compose WhatsApp message
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

      // Send WhatsApp message
      await twilioClient.messages.create({
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
  }

  /**
   * @desc Retrieves all tickets
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with all tickets
   */
  async getAllTickets(req, res) {
    try {
      const tickets = await ticketRepository.findAll();
      res.status(200).json(tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  /**
   * @desc Retrieves all tickets for a specific user
   * @param {Object} req - Express request object
   * @param {Object} req.user - User object (assumed to be added by authentication middleware)
   * @param {string} req.user.id - User ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with all tickets for the specified user
   */
  async getAllTicketsByUserId(req, res) {
    try {
      const userId = req.user.id;
      const tickets = await ticketRepository.findByUserId(userId);
      res.status(200).json(tickets);
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
  }
}

const ticketController = new TicketController();
export default ticketController;