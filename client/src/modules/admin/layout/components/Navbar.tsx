'use client'
import React from 'react';
import Link from 'next/link';
import { FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import {toast,Toaster } from 'react-hot-toast';
import {useRouter} from 'next/navigation';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { adminAuthState } from '../../atoms/atom';

export default function Navbar(): JSX.Element {  
  const router=useRouter();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useRecoilState<boolean>(adminAuthState);
  console.log(isAdminAuthenticated)
  useEffect(() => {
    // Check for admin authentication status when component mounts
    checkAdminAuth();
  }, [isAdminAuthenticated]);
  console.log(isAdminAuthenticated)
  const checkAdminAuth = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/check-auth', { withCredentials: true });
      console.log(response.data)
      setIsAdminAuthenticated(response.data.isAuthenticated);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAdminAuthenticated(false);
    }
  };


  const handleLogout=async()=>{
    const response =await axios.get('http://localhost:5000/api/admin/logout')
    if(response.data.success){
      setIsAdminAuthenticated(false);
    }
    router.push('/admin/login')
  }

  return (
    <nav className="fixed flex w-full  justify-between items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md z-50  ">
      <Toaster/>
      <Link href="/admin" className="text-2xl font-bold flex items-center space-x-2">
        <span className="text-yellow-300">🎬</span>
        <span>Book my show Admin</span>
      </Link>
      <div className="flex items-center gap-6">
     { isAdminAuthenticated &&  <button  onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center space-x-2">
          <FaSignOutAlt />  
          <span >Logout</span>
        </button>}  
      </div>
    </nav>
  );
}