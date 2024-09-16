'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar(): JSX.Element {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-gray-800 font-bold' : '';
  };

  return (
    <aside className="w-64 bg-gray-700 text-white h-[calc(100vh-64px)] overflow-y-auto fixed ">
      <ul className="p-0 m-0">
        {[
          { href: '/admin', label: 'Dashboard' },
          { href: '/admin/movies', label: 'Movies' },
          { href: '/admin/users', label: 'Users' },
          { href: '/admin/theatres', label: 'Theatres' },
          { href: '/admin/showtimes', label: 'Showtimes' },
          { href: '/admin/tickets', label: 'Tickets' },
        ].map((item) => (
          <li key={item.href} className="py-2">
            <Link 
              href={item.href} 
              className={`block px-4 py-2 hover:bg-gray-600 transition-colors ${isActive(item.href)}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}