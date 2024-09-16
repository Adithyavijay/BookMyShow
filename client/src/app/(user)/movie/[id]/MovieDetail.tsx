'use client'
import React, { useEffect, useState } from 'react';
import { Movie } from '@/modules/user/movies/types/types';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

interface MovieDetailProps {
   id: string
}

const MovieDetail: React.FC<MovieDetailProps> = ({ id }) => {
    const [movie, setMovie] = useState<Movie | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchMovie();
    }, []);

    const fetchMovie = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/movie/${id}`);
            setMovie(response.data);
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    }
    
    const handleBookTickets = () => {
        router.push(`/booking/${id}`);
      };

    if (!movie) return <div>Loading...</div>; 

    return (
        <div>
            {/* Hero Section with Poster and Details */}
            <div className="relative">
                <div className="absolute inset-0 bg-cover bg-center z-0" style={{backgroundImage: `url(http://localhost:5000${movie.poster})`, filter: 'blur(5px) brightness(0.5)'}}></div>
                
                <div className="relative z-10 container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Movie Poster */}
                        <div className="md:w-1/3">
                            <Image src={`http://localhost:5000${movie.poster}`} alt={movie.title} width={300} height={450} className="rounded-lg shadow-lg" />
                        </div>
                        
                        {/* Movie Details */}
                        <div className="md:w-2/3 text-white">
                            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                            <div className="mb-4">
                                <span className="bg-green-500 text-white px-2 py-1 rounded mr-2">{movie.certificate}</span>
                                <span>{movie.language}</span> • 
                                <span>{movie.duration} mins</span> • 
                                <span>{movie.genre}</span> • 
                                <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
                            </div>
                            <div className="mb-4">
                                <span className="text-yellow-400">★</span> {movie.averageRating.toFixed(1)}/5 • {movie.ratings.length} ratings
                            </div>
                            <button onClick={handleBookTickets} className="bg-red-600 text-white px-6 py-2 rounded-lg mb-4">Book tickets</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* About the movie */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-semibold mb-4">About the movie</h2>
                <p className="mb-8">{movie.description}</p>
                
                {/* Cast */}
                <h2 className="text-2xl font-semibold mb-4">Cast</h2>
                <div className="flex flex-wrap gap-8">
                    {movie.cast.map((member, index) => (
                        <div key={index} className="text-center">
                            <Image src={`http://localhost:5000${member.castPhoto}`} alt={member.castName} width={120} height={120} className="rounded-full mb-2" />
                            <p className="font-semibold">{member.castName}</p>
                           
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;