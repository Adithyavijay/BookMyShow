// components/AddTheaterModal.tsx
'use client';
import React, { useEffect, useState } from "react";
import { EditTheaterData } from "../types/type";
import axios from 'axios';


interface EditTheaterModalProps {
    onClose: () => void;
    id:string;
}


const EditTheaterModal: React.FC<EditTheaterModalProps> = ({onClose,id}) => {
    const [formData, setFormData] = useState<EditTheaterData>({
        name: '',
        location: '',
        capacity: 0
    }); 
    const api = process.env.API_BASE_URL;

    useEffect(()=>{
        const fetchTheaters = async () => {
            console.log('hii')
            try {
              const response = await axios.get(`${api}/admin/get-theater-by-id/${id}`);
              console.log(response)
              setFormData(response.data.theaters);
            } catch (error) {
              console.error('Error fetching theaters:', error);
            }
          };
          fetchTheaters();
    },[])
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'capacity' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold p-4 border-b">Edit Theater</h2>
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2 font-bold">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="location" className="block mb-2 font-bold">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="capacity" className="block mb-2 font-bold">Capacity</label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">Add Theater</button>
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTheaterModal;