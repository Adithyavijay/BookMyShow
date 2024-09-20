"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaSearch, FaChevronLeft, FaChevronRight, FaEnvelope, FaTicketAlt } from 'react-icons/fa';
import Image from 'next/image';
import { format } from 'date-fns';

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  totalTickets: number;
  lastBooking: string ;
}

interface ApiResponse<T> {
  data : T;
  status : boolean;
  message: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const api = process.env.API_BASE_URL;

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse<User[]>>(`${api}/admin/users`);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  }, [api]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const formatDate = (dateString: string) => {
    if (!dateString) return 'No bookings';
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };
  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-gradient-to-br from-purple-100 to-indigo-100 min-h-screen">
      <Toaster />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">User Management</h1>
        <div className="flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="p-2 pl-10 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Profile</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Tickets Booked</th>
              <th className="p-3 text-left">Last Booking</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={user.profilePicture || '/default-avatar.png'}
                      alt={user.username}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-400 mr-2" />
                    {user.email}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <FaTicketAlt className="text-gray-400 mr-2" />
                    {user.totalTickets} tickets
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <FaTicketAlt className="text-gray-400 mr-2" />
                   {formatDate(user.lastBooking)}
                  </div>
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

export default Users;