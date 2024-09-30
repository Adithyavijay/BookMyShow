"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import AddShowtime from "./AddShowtime";
import { ClipLoader } from "react-spinners";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import EditShowtime from './editShowtime';
import DeleteShowtime from './DeleteShowtime';
import { adminApi } from "@/utils/api";

interface Movie {
    _id: string;
    title: string;
}

interface Theater {
    _id: string;
    name: string;
}

interface ShowTime {
    _id: string;
    movie: Movie;
    theater: Theater;
    date: string;
    startTime: string;
    endTime: string;
    screenType: string;
    isCancellable: boolean;
    availableSeats: string;
}

const ShowTimes: React.FC = () => {
    const [showTimes, setShowTimes] = useState<ShowTime[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddShowTimeOpen, setIsAddShowTimeOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedShowTime, setSelectedShowTime] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedShowTimeId, setSelectedShowTimeId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; showtimeId: string | null }>({
    isOpen: false,
    showtimeId: null
  });

    const api = process.env.API_BASE_URL;

    useEffect(() => {
        fetchShowTimes();
    }, []);

    const fetchShowTimes = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/api/admin/showtimes");
            setShowTimes(response.data.data);   
        } catch (error) {
            console.error("Error fetching showtimes:", error);
            toast.error("Failed to fetch showtimes");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const filteredShowTimes = showTimes.filter((showTime) =>
        showTime.movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showTime.theater.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredShowTimes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredShowTimes.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
   
    const handleAddSuccess=()=>{
        fetchShowTimes();
    }

    const handleEditClick = (showtimeId: string) => {
        setSelectedShowTimeId(showtimeId);
        setEditModalOpen(true);
      }; 
      const handleUpdateSuccess = () => {
        fetchShowTimes();
      };

  const handleDeleteClick = (showtimeId: string) => {
    setDeleteModal({ isOpen: true, showtimeId });
  };

  const handleDeleteSuccess = () => {
    fetchShowTimes();
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
           
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-indigo-800 mb-4">Showtime Management</h1>
                <div className="flex justify-between items-center">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search showtimes..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="p-2 pl-10 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <button
                        onClick={() => setIsAddShowTimeOpen(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out flex items-center"
                    >
                        <FaPlus className="mr-2" /> Add Showtime
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th className="p-3 text-left">Movie</th>
                            <th className="p-3 text-left">Theater</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Start Time</th>
                            <th className="p-3 text-left">End Time</th>
                            <th className="p-3 text-center">Cancellable</th>
                            <th className="p-3 text-center">Available Seats</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((showTime) => (
                            <tr key={showTime._id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{showTime.movie.title}</td>
                                <td className="p-3">{showTime.theater.name}</td>
                                <td className="p-3">{new Date(showTime.date).toLocaleDateString()}</td>
                                <td className="p-3">{new Date(showTime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td className="p-3">{new Date(showTime.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td className="p-3 text-center">{showTime.isCancellable ? 'Yes' : 'No'}</td>
                                <td className="p-3 text-center">{showTime.availableSeats}</td>
                                <td className="p-3 text-center">
                                <button
                onClick={() => handleEditClick(showTime._id)}
                className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition duration-300 ease-in-out mr-2"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteClick(showTime._id)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 ease-in-out"
              >
                                        <FaTrash />
                                    </button>
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
            {isAddShowTimeOpen 
            && 
             <AddShowtime onSuccess={handleAddSuccess} onClose={() => setIsAddShowTimeOpen(false)} />}
            {/* Add EditShowtime and DeleteShowtime modals here when implemented */}
            {editModalOpen && selectedShowTimeId && (
        <EditShowtime
          onClose={() => setEditModalOpen(false)}
          showtimeId={selectedShowTimeId}
          onUpdate={handleUpdateSuccess}
        />
        
      )} 
       {deleteModal.isOpen && deleteModal.showtimeId && (
        <DeleteShowtime
          showtimeId={deleteModal.showtimeId}
          movieTitle={showTimes.find(st => st._id === deleteModal.showtimeId)?.movie.title || ''}
          onClose={() => setDeleteModal({ isOpen: false, showtimeId: null })}
          onDelete={handleDeleteSuccess}
        />
      )}
        </div>
    );
};

export default ShowTimes;