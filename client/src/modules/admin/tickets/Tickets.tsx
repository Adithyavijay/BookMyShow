
'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { FaSearch, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { adminApi } from '@/utils/api';

interface Ticket {
  _id: string;
  booking: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  showtime: {
    _id: string;
    startTime: string;
  };
  movieName: string;
  theaterName: string;
  showDateTime: string;
  seats: string[];
  status: 'active' | 'used' | 'cancelled';
  createdAt: string;
}

const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const api = process.env.API_BASE_URL;

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.get(`/tickets`);
      setTickets(response.data.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to fetch tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.movieName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.theaterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleViewDetails = (ticketId: string) => {
    // Implement view details functionality
    console.log('View details for ticket:', ticketId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-purple-100 to-indigo-100 min-h-screen">
      <Toaster />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">Ticket Management</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 pl-10 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Movie</th>
              <th className="p-3 text-left">Theater</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Show Date & Time</th>
              <th className="p-3 text-left">Seats</th>
              <th className="p-3 text-center">Status</th>
             
            </tr>
          </thead>
          <tbody>
            {currentItems.map((ticket) => (
              <tr key={ticket._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{ticket.movieName}</td>
                <td className="p-3">{ticket.theaterName}</td>
                <td className="p-3">{ticket.user.username}</td>
                <td className="p-3">{new Date(ticket.showDateTime).toLocaleString()}</td>
                <td className="p-3">{ticket.seats.join(', ')}</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${ticket.status === 'active' ? 'bg-green-200 text-green-800' : 
                      ticket.status === 'used' ? 'bg-gray-200 text-gray-800' : 
                      'bg-red-200 text-red-800'}`}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                currentPage === index + 1 ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FaChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Tickets;