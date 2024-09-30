// components/EditTheaterModal.tsx

'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { Theater } from '../types/type';
import { adminApi } from '@/utils/api';

interface EditTheaterModalProps {
  onClose: () => void;
  id: string;
  onSuccess : ()=>void;
}

const EditTheaterModal: React.FC<EditTheaterModalProps> = ({ onClose, id ,onSuccess }) => {
  const [theater, setTheater] = useState<Theater | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    
    fetchTheater();
  }, [id]);
 
  const fetchTheater = async () => {
    try {
      const response = await adminApi.get(`/get-theater-by-id/${id}`);
      const fetchedTheater = response.data.theater;
      setTheater(fetchedTheater);
      setName(fetchedTheater.name);
      setLocation(fetchedTheater.location);
    } catch (error) {
      console.error('Error fetching theater:', error);
      setError('Failed to fetch theater data');
    }
  };


  const handleSubmit = async (e: React.FormEvent) => { 
    
    e.preventDefault();
    try {
      const response = await adminApi.put(`/update-theater/${id}`, {
        name,
        location
      });
      if (response.status === 200) {
        onClose();
        onSuccess();
        // You might want to add a success message or refresh the theater list here
      }
    } catch (error) {
      console.error('Error updating theater:', error);
      setError('Failed to update theater');
    }
  };

  if (!theater) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-800">Edit Theater</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              value={100}
              className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
              disabled={true}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Theater
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTheaterModal;