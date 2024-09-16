'use client';
import React, { useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';

interface DeleteMovieProps {
  onClose: () => void;
  movieId: string;
  movieTitle: string;
  onDeleteSuccess: () => void;
}

const DeleteMovie: React.FC<DeleteMovieProps> = ({ onClose, movieTitle, movieId, onDeleteSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const api = process.env.API_BASE_URL;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${api}/admin/delete-movie/${movieId}`);
      onDeleteSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting movie:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Delete Movie</h2>
        <p className="mb-4">
          Are you sure you want to delete the movie - <span className="font-semibold">{movieTitle}</span>?
        </p>
        <p className="mb-6 text-red-600">
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ClipLoader color="#ffffff" loading={isLoading} size={20} />
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

export default DeleteMovie;