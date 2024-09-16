// components/AddTheaterModal.tsx
'use client';
import React, { useState } from "react";

interface AddTheaterData {
    name: string;
    location: string;
    capacity: number;
} 

interface AddTheaterModalProps {
    onClose: () => void;
    onAddTheater: (theaterData: AddTheaterData) => void;
}

const AddTheaterModal: React.FC<AddTheaterModalProps> = ({ onClose, onAddTheater }) => {
    const [formData, setFormData] = useState<AddTheaterData>({
        name: '',
        location: '',
        capacity: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'capacity' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTheater(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold p-4 border-b">Add New Theater</h2>
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

export default AddTheaterModal;