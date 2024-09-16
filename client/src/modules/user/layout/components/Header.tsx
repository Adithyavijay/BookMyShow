'use client'
import React from 'react'
import Image from 'next/image';
import { IoIosSearch } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";
import { HiBars3 } from "react-icons/hi2";
import { useRecoilState } from 'recoil';
import { signupModalState } from '@/atoms/modalAtom';

const Header = () => { 

  const [showModal,setShowModal]=useRecoilState(signupModalState)

  return (
    <header className='bg-white shadow-md'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex items-center justify-between'> 
          <div className="flex items-center space-x-6">
            <Image src='/icons/bookmyshow.svg' width={115} height={35} alt='company logo' className="w-28 h-auto"/>
            <div className="relative">
              <input
                type="text"
                className='w-64 sm:w-80 md:w-96 p-2 pl-10 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300' 
                placeholder='Search for Movies, Events, Plays, Sports'
              /> 
              <IoIosSearch className='absolute top-1/2 left-3 transform -translate-y-1/2 text-lg text-gray-500' />
            </div>
          </div>
          <div className='flex items-center space-x-6'>
            <div className='flex items-center space-x-1 cursor-pointer hover:text-red-500 transition duration-300'>
              <span className='text-sm font-medium'>Kochi</span>
              <IoChevronDownOutline className='text-sm'/>
            </div>
            <button onClick={()=>setShowModal(true)} className='bg-[#f84464] text-white text-sm py-2 px-6 rounded-full hover:bg-[#e23b59] transition duration-300 font-medium'>
              Sign in  
            </button>
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