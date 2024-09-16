import React from 'react';
import Link from 'next/link';

export default function Navbar(): JSX.Element {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 text-white relative">
      <Link href="/admin" className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">
        Movie Booking Admin
      </Link>
      <div className="flex items-center gap-4 ml-auto">
        <span>Admin</span>
        <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors">
          Logout
        </button>
      </div>
    </nav>
  );
}