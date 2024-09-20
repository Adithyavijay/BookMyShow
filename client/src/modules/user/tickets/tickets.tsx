  'use client'
  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { FaTicketAlt, FaCalendarAlt, FaClock, FaCouch } from 'react-icons/fa';
  import { format } from 'date-fns';

  interface Ticket {
    _id: string;
    movieName: string;
    theaterName: string;
    showDateTime: string;
    seats: string[];
    status: 'active' | 'used' | 'cancelled';
    qrCode: string;
  }

  const Tickets: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      fetchTickets();
    }, []);

    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/tickets');
        setTickets(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setIsLoading(false);
      }
    };

    if (isLoading) {
      return <div className="text-center py-10">Loading tickets...</div>;
    }

    if (tickets.length === 0) {
      return <div className="text-center py-10">No tickets found.</div>;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">My Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 text-white py-2 px-4">
                <h3 className="text-lg font-semibold">{ticket.movieName}</h3>
              </div>
              <div className="p-4">
                <p className="flex items-center mb-2">
                  <FaTicketAlt className="mr-2" /> {ticket.theaterName}
                </p>
                <p className="flex items-center mb-2">
                  <FaCalendarAlt className="mr-2" /> {format(new Date(ticket.showDateTime), 'MMMM d, yyyy')}
                </p>
                <p className="flex items-center mb-2">
                  <FaClock className="mr-2" /> {format(new Date(ticket.showDateTime), 'h:mm a')}
                </p>
                <p className="flex items-center mb-2">
                  <FaCouch className="mr-2" /> Seats: {ticket.seats.join(', ')}
                </p>
                <div className="mt-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    ticket.status === 'active' ? 'bg-green-200 text-green-800' :
                    ticket.status === 'used' ? 'bg-gray-200 text-gray-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-4 border-t">
                <img src={ticket.qrCode} alt="QR Code" className="mx-auto h-32 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default Tickets;