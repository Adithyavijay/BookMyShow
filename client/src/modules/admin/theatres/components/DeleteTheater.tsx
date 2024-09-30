/* eslint-disable react/no-unescaped-entities */
// components/DeleteTheaterModal.tsx

'use client';
import React from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { adminApi } from '@/utils/api';

interface DeleteTheaterModalProps {
  onClose: () => void;
  theaterId: string;
  theaterName: string;
  onDeleteSuccess: () => void;
}

const DeleteTheaterModal: React.FC<DeleteTheaterModalProps> = ({ onClose, theaterId, theaterName, onDeleteSuccess }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      await adminApi.delete(`/delete-theater/${theaterId}`);
      onDeleteSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting theater:', error);
      setError('Failed to delete theater. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-600">Delete Theater</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>
        <p className="mb-6">
          Are you sure you want to delete the theater "{theaterName}"? This action cannot be undone.
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Theater'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTheaterModal;