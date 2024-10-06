'use client'
import React from 'react';
import { motion } from 'framer-motion';

const AdminLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
     
        className="bg-white p-8 rounded-lg shadow-2xl flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full mb-4"
        ></motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading</h2>
        <p className="text-gray-600">Please wait while we set up the admin dashboard...</p>
      </motion.div>
    </div>
  );
};

export default AdminLoading;