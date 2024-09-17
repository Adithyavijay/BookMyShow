import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios'; 
import { userState } from '@/atoms/modalAtom';
import { useRecoilState } from 'recoil';

interface UserInfo {
  name: string;
  profilePicture: string;
}

const UserProfile: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [,setUser]= useRecoilState(userState)
  const router = useRouter();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
    const response = await axios.get('http://localhost:5000/api/user/logout')
    console.log(response.data) 
      setUser(null)
      localStorage.removeItem('userInfo');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }; 
  
  const handleTickets = async () => {
    try {
      router.push('/tickets');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }; 
  

  // if (!userInfo) return <></>

  return (
      !userInfo?<></>:   <div className="relative" ref={dropdownRef}> 
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 focus:outline-none group"
      >
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
          Hi, {userInfo.name.split(' ')[0]}
        </span> 
       
        <Image
          src={userInfo.profilePicture}
          alt={userInfo.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        {isDropdownOpen ? <FaChevronUp className="text-gray-600 group-hover:text-gray-900"/> : <FaChevronDown className="text-gray-600 group-hover:text-gray-900" />}
      </button>
      
      {isDropdownOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 transform transition-all duration-200 ease-out opacity-0 translate-y-4" 
          style={{ opacity: isDropdownOpen ? 1 : 0, transform: isDropdownOpen ? 'translateY(0)' : 'translateY(10px)' }}
        >
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
          >
            Logout
          </button>
          <button
            onClick={handleTickets}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
          >
            Tickets
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
