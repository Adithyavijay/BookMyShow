'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Movie } from '../types/types';
import { useRouter } from 'next/navigation';
import { FaSortAmountDown, FaLanguage } from 'react-icons/fa';
import { MdTheaters } from 'react-icons/md';

const Movies: React.FC = () => {  
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [sortByRating, setSortByRating] = useState<boolean>(false);
    const api = 'http://localhost:5000/api'; 
    const router = useRouter();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await axios.get<Movie[]>(`${api}/user/movies`);
            setMovies(response.data);
            
            // Extract unique genres and languages
            const uniqueGenres = Array.from(new Set(response.data.map(movie => movie.genre).filter((genre): genre is string => genre !== undefined)));
            const uniqueLanguages = Array.from(new Set(response.data.map(movie => movie.language).filter((language): language is string => language !== undefined)));
            setGenres(uniqueGenres);
            setLanguages(uniqueLanguages);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    }

    const handleClick = (movieId: string) => { 
        router.push(`/movie/${movieId}`);
    }

    const filteredAndSortedMovies = movies
        .filter(movie => selectedGenre ? movie.genre === selectedGenre : true)
        .filter(movie => selectedLanguage ? movie.language === selectedLanguage : true)
        .sort((a, b) => {
            if (sortByRating) {
                return b.averageRating - a.averageRating;
            }
            return 0;
        });

    return (
        <div className="px-4 py-8 lg:px-[6rem]">
            <h2 className="text-3xl font-bold mb-6">Recommended Movies</h2>
            
            {/* Sorting and Filtering Options */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative">
                    <select
                        className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                        <option value="">All Genres</option>
                        {genres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                    <MdTheaters className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="relative">
                    <select
                        className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                        <option value="">All Languages</option>
                        {languages.map(language => (
                            <option key={language} value={language}>{language}</option>
                        ))}
                    </select>
                    <FaLanguage className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <button
                    className={`flex items-center px-4 py-2 rounded-md text-sm ${
                        sortByRating ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setSortByRating(!sortByRating)}
                >
                    <FaSortAmountDown className="mr-2" />
                    Sort by Rating
                </button>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredAndSortedMovies.map((movie) => (
                    <div key={movie._id} className="flex flex-col">
                        <div onClick={() => handleClick(movie._id)} className="relative h-80 mb-2 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-all">
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