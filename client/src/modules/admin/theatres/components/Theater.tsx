'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddTheaterModal from "./AddTheater";
import {Theater,AddTheaterData} from '../types/type'
import EditTheaterModal from "./EditTheater";



const Theaters: React.FC = () => {
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isAddTheaterOpen, setIsAddTheaterOpen] = useState<boolean>(false);
    const [ editModal,setEditModal]=useState<boolean>(false)
    console.log(theaters)
    useEffect(() => {
        fetchTheaters();
    }, [])

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
    ) ;

    return (
        <div className="p-8 bg-gray-100">
            <div className="flex justify-between mb-6">
                <input
                    type="text"
                    placeholder="Search theaters..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="p-2 border rounded w-64"
                />
                <button
                    onClick={() => setIsAddTheaterOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Theater
                </button>
            </div>
            <table className="w-full bg-white shadow-md rounded">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Location</th>
                        <th className="p-3 text-left">Capacity</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTheaters.map((theater) => (
                        <tr key={theater._id} className="border-b">
                            <td className="p-3">{theater.name}</td>
                            <td className="p-3">{theater.location}</td>
                            <td className="p-3">{theater.capacity}</td>
                            <td className="p-3">
                                <button onClick={()=>setEditModal(true)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2">
                                    Edit
                                </button>
                                { editModal && <EditTheaterModal 
                                onClose={()=>setEditModal(false)}
                                id={theater._id}
                                />}
                                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> 
            {  isAddTheaterOpen && <AddTheaterModal
                onClose={() => setIsAddTheaterOpen(false)}
                onAddTheater={handleAddTheater}
            />}      
        </div>
    );
};

export default Theaters;


