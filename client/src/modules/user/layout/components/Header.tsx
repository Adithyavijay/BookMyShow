// components/Header.tsx
'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image';
import { IoIosSearch } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";
import { HiBars3 } from "react-icons/hi2";
import { useRecoilState } from 'recoil';
import { signupModalState, userState } from '@/atoms/modalAtom';
import UserProfile from '../../sign-up/components/userProfile';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Movie } from '../../movies/types/types';
import SearchResults from '../../movies/components/searchResults';

const Header = () => { 
  const [showModal, setShowModal] = useRecoilState(signupModalState);
  const [user] = useRecoilState(userState);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    router.push('/');
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/search-movies?query=${value}`);
        setSearchResults(response.data);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching movies:', error);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className='bg-white shadow-md'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex items-center justify-between'> 
          <div className="flex items-center space-x-6">
            <Image onClick={handleClick} src='/icons/bookmyshow.svg' width={115} height={35} alt='company logo' className="w-28 h-auto cursor-pointer hover:scale-110 transition-transform ease-out"/>
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className='w-64 sm:w-80 md:w-96 p-2 pl-10 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300' 
                placeholder='Search for Movies, Events, Plays, Sports'
              /> 
              <IoIosSearch className='absolute top-1/2 left-3 transform -translate-y-1/2 text-lg text-gray-500' />
              {showResults && (
                <SearchResults movies={searchResults} onClose={() => setShowResults(false)} />
              )}
            </div>
          </div>
          <div className='flex items-center space-x-6'>
            <div className='flex items-center space-x-1 cursor-pointer hover:text-red-500 transition duration-300'>
              <span className='text-sm font-medium'>Kochi</span>
              <IoChevronDownOutline className='text-sm'/>
            </div>
            {user ? <UserProfile/> : 
               <button onClick={() => setShowModal(true)} className='bg-[#f84464] text-white text-sm py-2 px-6 rounded-full hover:bg-[#e23b59] transition duration-300 font-medium'>
               Sign in  
             </button>
            }
           
            <div className='cursor-pointer hover:text-red-500 transition duration-300'>
              <HiBars3 className='text-2xl' />
            </div>   
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header