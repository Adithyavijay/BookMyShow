import React, { use, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { BsCalendar2Check } from 'react-icons/bs';
import malayalamFilmsImg from '@images/malayalamFilms.jpg';
import dune3Img from '@images/Winners.webp';
import mi8Img from '@images/festive.jpg';
import { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import ShimmerUi from '../layout/ShimmerUi';
// Define types for movie data
interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  genre: string; 
  upcoming  : boolean;
  image :  StaticImageData 
  photos : string[];
}

const ComingSoon = () => { 

  const [ movies , setMovies] = useState<Movie[]>() 

  useEffect(()=>{
    fetchMovies()
  },[])
  const fetchMovies = async()=>{
    const response = await axios.get( `${process.env.API_BASE_URL}/user/movies`)
    setMovies(response.data.data)
  }   
  const filteredMovies = movies?.filter(movie=>movie.upcoming )
  
 

  return (
    <div className="bg-gray-50 py-12 px-4 lg:px-24">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Coming Soon</h2>
        <button className="text-red-500 hover:text-red-600 font-semibold">
          View All
        </button>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar"> 
        {filteredMovies ? filteredMovies.map((movie) => (
          <div 
            key={movie.id} 
            className="min-w-[240px] bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image wrapper with fixed aspect ratio */}
            <div className="relative w-full h-72 rounded-t-lg overflow-hidden">
              <Image
                src={`${process.env.BASE_URL}${movie.photos[0]}`}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={movie.id === 1} // Priority loading for first image
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{movie.genre}</p>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <BsCalendar2Check className="mr-2" />
                {movie.releaseDate}
              </div>
              <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors">
                Releasing Soon 
              </button>
            </div>
          </div>
        )) : <ShimmerUi/> }
      </div>
    </div>
  );
};

export default ComingSoon;