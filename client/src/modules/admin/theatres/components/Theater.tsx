'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddTheaterModal from "./AddTheater";
import EditTheaterModal from "./EditTheater";
import { Theater, AddTheaterData } from '../types/type';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DeleteTheaterModal from "./DeleteTheater";

const Theaters: React.FC = () => {
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isAddTheaterOpen, setIsAddTheaterOpen] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [editTheaterId, setEditTheaterId] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [theatersPerPage] = useState(5);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [deleteTheaterId, setDeleteTheaterId] = useState<string>("");
    const [deleteTheaterName, setDeleteTheaterName] = useState<string>("");

    useEffect(() => {
        fetchTheaters();
    }, []);

    const fetchTheaters = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/get-theaters");
            setTheaters(response.data.theaters);
        } catch (error) {
            console.error("Error fetching theaters:", error);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleAddTheater = async (theaterData: AddTheaterData) => {
        try {
            const response = await axios.post("http://localhost:5000/api/admin/upload-theater", theaterData);
            if (response.status === 201) {
                fetchTheaters();
                setIsAddTheaterOpen(false);
            } else {
                console.error("Failed to add theater", response);
            }
        } catch (error) {
            console.error("Error adding theater:", error);
        }
    };

    const filteredTheaters = theaters.filter((theater) =>
        theater.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const indexOfLastTheater = currentPage * theatersPerPage;
    const indexOfFirstTheater = indexOfLastTheater - theatersPerPage;
    const currentTheaters = filteredTheaters.slice(indexOfFirstTheater, indexOfLastTheater);
    const totalPages = Math.ceil(filteredTheaters.length / theatersPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleEditTheater =()=>{
        fetchTheaters();
    }
    const handleDeleteClick = (id: string, name: string) => {
        setDeleteTheaterId(id);
        setDeleteTheaterName(name);
        setDeleteModal(true);
    };

    const handleDeleteSuccess = () => {
        fetchTheaters();
    };  
    return (
        <div className="p-8 bg-gradient-to-br from-purple-100 to-indigo-100 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-indigo-800 mb-4">Theaters Management</h1>
                <div className="flex justify-between items-center">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search theaters..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="p-2 pl-10 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <button
                        onClick={() => setIsAddTheaterOpen(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out flex items-center"
                    >
                        <FaPlus className="mr-2" /> Add Theater
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Location</th>
                            <th className="p-3 text-left">Capacity</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTheaters.map((theater) => (
                            <tr key={theater._id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{theater.name}</td>
                                <td className="p-3">{theater.location}</td>
                                <td className="p-3">{theater.capacity}</td>
                                <td className="p-3">
                                    <button 
                                        onClick={() => {
                                            setEditTheaterId(theater._id);
                                            setEditModal(true);
                                        }} 
                                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition duration-300 ease-in-out mr-2"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClick(theater._id, theater.name)}
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
            {isAddTheaterOpen && (
                <AddTheaterModal
                    onClose={() => setIsAddTheaterOpen(false)}
                    onAddTheater={handleAddTheater}
                />
            )}
            {editModal && (
                <EditTheaterModal
                    onClose={() => setEditModal(false)}
                    id={editTheaterId} 
                    onSuccess={handleEditTheater}
                />
            )}
              {deleteModal && (
                <DeleteTheaterModal
                    onClose={() => setDeleteModal(false)}
                    theaterId={deleteTheaterId}
                    theaterName={deleteTheaterName}
                    onDeleteSuccess={handleDeleteSuccess}
                />
            )}
        </div>
    );
};

export default Theaters;