'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import {Movie} from '../types/types'
import { useRouter } from 'next/navigation';

const Movies: React.FC = () => {  
    const [movies, setMovies] = useState<Movie[]>([]);
    const api = 'http://localhost:5000/api'; 
    const router=useRouter();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get<Movie[]>(`${api}/user/movies`); 
                console.log(response.data)
                setMovies(response.data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        }
        fetchMovies(); 
    }, []); 

    const handleClick=(movieId:string)=>{ 
        router.push(`/movie/${movieId}`)
    }

    return (
        <div className="px-4 py-8 lg:px-[6rem]">
            <h2 className="text-2xl font-bold mb-4">Recommended Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 ">
                {movies.map((movie) => (
                    <div key={movie._id} className="flex flex-col">
                        <div onClick={()=>{handleClick(movie._id)}} className=" relative h-80 mb-2 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-all">
                            <Image 
                                src={`http://localhost:5000${movie.photos[0]}`} 
                                alt={movie.title}
                                layout="fill"
                                objectFit="cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                                <div className="flex items-center">
                                    <span className="text-yellow-400 mr-1">★</span>
                                    <span>{movie.averageRating.toFixed(1)}/5</span>
                                    <span className="ml-2 text-sm">{movie.ratings.length} Ratings</span>
                                </div>
                            </div>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{movie.title}</h3>
                        <p className="text-sm text-gray-600">{movie.genre}</p>
                        <p className="text-xs text-gray-500">{movie.language} • {movie.certificate}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Movies;