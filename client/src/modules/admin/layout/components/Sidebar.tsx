'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartBar, FaFilm, FaUsers, FaTheaterMasks, FaClock, FaTicketAlt } from 'react-icons/fa';

export default function Sidebar(): JSX.Element {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' : '';
  };

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: FaChartBar },
    { href: '/admin/movies', label: 'Movies', icon: FaFilm },
    { href: '/admin/users', label: 'Users', icon: FaUsers },
    { href: '/admin/theatres', label: 'Theatres', icon: FaTheaterMasks },
    { href: '/admin/showtimes', label: 'Showtimes', icon: FaClock },
    { href: '/admin/tickets', label: 'Tickets', icon: FaTicketAlt },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 h-[100vh] overflow-y-auto fixed shadow-lg">
      <div className="p-5">
        <h2 className="text-2xl font-bold text-white mb-6">Admin Panel</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-700 ${isActive(item.href)}`}
              >
                <item.icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
