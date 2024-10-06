// app/loading.tsx
'use client'
import React from 'react';
import { motion } from 'framer-motion';

const UserLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center z-50">
      <motion.div
      
        className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center"
      >
        <motion.div className="mb-6">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="inline-block w-4 h-4 bg-red-500 rounded-full mx-1"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Amazing Movies</h2>
        <p className="text-gray-600 text-center">
          Get ready for an incredible cinematic experience!
          <br />
          We`re preparing the best selection just for you.
        </p>
      </motion.div>
    </div>
  );
};

export default UserLoading;