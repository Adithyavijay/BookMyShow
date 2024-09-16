"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
// import AddShowTime from "./AddShowTime";
// import EditShowTime from "./EditShowTime";
// import DeleteShowTime from "./DeleteShowTime";
import { toast, Toaster } from "react-hot-toast";
import AddShowtime from "./AddShowtime";
import { ClipLoader } from "react-spinners";
import ReactPaginate from 'react-paginate';

interface Movie {
    _id : string ,
    title : string
}
interface Theater {
    _id : string ,
    name : string
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
    availableSeats : string;
}   



const ShowTimes: React.FC = () => {
    const [showTimes, setShowTimes] = useState<ShowTime[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddShowTimeOpen, setIsAddShowTimeOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedShowTime, setSelectedShowTime] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(4) 
    const api = process.env.API_BASE_URL;

    useEffect(() => {
        fetchShowTimes();
    }, []);

    const fetchShowTimes = async () => {
        setIsLoading(true); // Set loading to true when fetching starts
        try {
            const response = await axios.get(api + "/admin/showtimes");
            console.log(response.data)
            setShowTimes(response.data.showtimes);
        } catch (error) {
            console.error("Error fetching showtimes:", error);
            toast.error("Failed to fetch showtimes");
        } finally {
            setIsLoading(false); // Set loading to false when fetching ends
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };



    const filteredShowTimes = showTimes.filter((showTime) =>
        showTime.movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showTime.theater.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pageCount = Math.ceil(filteredShowTimes.length / itemsPerPage);

    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageItems = filteredShowTimes.slice(offset, offset + itemsPerPage);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader color="#4A90E2" size={50} />
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-100">
            <Toaster toastOptions={{ duration: 1200 }} />
            <div className="flex justify-between mb-6">
                <input
                    type="text"
                    placeholder="Search showtimes..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="p-2 border rounded w-64"
                />
                <button
                    onClick={() => setIsAddShowTimeOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Showtime
                </button>
            </div>
            <table className="w-full bg-white shadow-md rounded">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3 text-left">Movie</th>
                        <th className="p-3 text-left">Theater</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Start Time</th>
                         <th className="p-3 text-left">End Time</th>
                        <th className="p-3 text-left">Cancellable</th>
                        <th className="p-3 text-left">Available Seats</th>    
                        <th className="p-3 text-left">Actions</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {currentPageItems.map((showTime) => (
                        <tr key={showTime._id} className="border-b">
                            <td className="p-3">{showTime.movie.title}</td>
                            <td className="p-3">{showTime.theater.name}</td>
                            <td className="p-3">{new Date(showTime.date).toLocaleDateString()}</td>
                            <td className="p-3">{new Date(showTime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="p-3">{new Date(showTime.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="text-center">{showTime.isCancellable ? 'Yes' : 'No'}</td>
                            <td className="text-center">{showTime.availableSeats}</td>
                            <td className="p-3">
                                <button 
                                    onClick={() => {
                                        setSelectedShowTime(showTime._id);
                                        setEditModal(true);
                                    }} 
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => {
                                        setSelectedShowTime(showTime._id);
                                        setDeleteModal(true);
                                    }} 
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

            <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"pagination flex justify-center mt-8 space-x-2"}
                previousLinkClassName={"px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"}
                nextLinkClassName={"px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
                activeClassName={"bg-blue-500 text-white"}
                pageClassName={"px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"}
            />

            { isAddShowTimeOpen && <AddShowtime 
              onClose={()=>setIsAddShowTimeOpen(false)}
                />}
        </div>
    );
};

export default ShowTimes;