/* eslint-disable react/no-unescaped-entities */
// components/DeleteShowtime.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { toast,Toaster   } from 'react-hot-toast';
import { adminApi } from '@/utils/api';

interface DeleteShowtimeProps {
  showtimeId: string;
  movieTitle: string;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteShowtime: React.FC<DeleteShowtimeProps> = ({ showtimeId, movieTitle, onClose, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const api = process.env.API_BASE_URL;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await adminApi.delete(`/showtimes/${showtimeId}`);
      toast.success('Showtime deleted successfully');
      onDelete();
      onClose();
    } catch (error) {
      console.error('Error deleting showtime:', error);
      toast.error('Failed to delete showtime');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
         <Toaster/>
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Delete Showtime</h2>
        <p className="mb-4">
          Are you sure you want to delete the showtime for "{movieTitle}"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 flex items-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <ClipLoader color="#ffffff" size={20} />
                <span className="ml-2">Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteShowtime;