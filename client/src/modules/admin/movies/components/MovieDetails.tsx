// MovieDetails.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { FaTimes, FaStar, FaCalendar, FaClock, FaLanguage, FaFilm } from 'react-icons/fa';

interface MovieDetailsProps {
  movieId: string;
  onClose: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${process.env.API_BASE_URL}/admin/movies/${movieId}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="text-white text-2xl">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors duration-300"
        >
          <FaTimes size={24} />
        </button>
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-1/3 ">
            <Image
              src={`http://localhost:5000${movie.poster}`}
              alt={movie.title}
              width={400}
              height={450}
              objectFit="cover"
              className="rounded-lg shadow-lg transform hover:scale-105 mt-16 transition-transform duration-300"
            />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-4xl font-bold mb-4 text-indigo-800">{movie.title}</h2>
            <div className="bg-white bg-opacity-50 rounded-lg p-6 shadow-md">
              <p className="mb-2 flex items-center"><FaStar className="text-yellow-500 mr-2" /> <strong className="text-gray-700">Genre:</strong> <span className="ml-2 text-indigo-700">{movie.genre}</span></p>
              <p className="mb-2 flex items-center"><FaCalendar className="text-green-500 mr-2" /> <strong className="text-gray-700">Release Date:</strong> <span className="ml-2 text-indigo-700">{movie.releaseDate}</span></p>
              <p className="mb-2 flex items-center"><FaFilm className="text-red-500 mr-2" /> <strong className="text-gray-700">Director:</strong> <span className="ml-2 text-indigo-700">{movie.director}</span></p>
              <p className="mb-2 flex items-cente"><FaLanguage className="text-blue-500 mr-2" /> <strong className="text-gray-700">Language:</strong> <span className="ml-2 text-indigo-700">{movie.language}</span></p>
              <p className="mb-2 flex items-center"><FaClock className="text-purple-500 mr-2" /> <strong className="text-gray-700">Duration:</strong> <span className="ml-2 text-indigo-700">{movie.duration} minutes</span></p>
              <p className="mb-2 flex items-center"><FaStar className="text-orange-500 mr-2" /> <strong className="text-gray-700">Certificate:</strong> <span className="ml-2 text-indigo-700">{movie.certificate}</span></p>
            </div>
            <div className="mt-4 bg-white bg-opacity-50 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-indigo-800">Description</h3>
              <p className="text-gray-700">{movie.description}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-3xl font-bold mb-6 text-center text-indigo-800">Cast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movie.cast.map((castMember: any, index: number) => (
              <div key={index} className="text-center group">
                <div className="w-32 h-32 mx-auto mb-3 relative overflow-hidden rounded-full shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={`http://localhost:5000${castMember.castPhoto}`}
                    alt={castMember.castName}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <p className="text-sm font-medium text-indigo-700 group-hover:text-indigo-900 transition-colors duration-300">{castMember.castName}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12">
  <h3 className="text-3xl font-bold mb-6 text-center text-indigo-800">Gallery</h3>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {movie.photos.map((photo: string, index: number) => (
      <div key={index} className="relative w-full pb-[100%] overflow-hidden rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
        <Image
          src={`http://localhost:5000${photo}`}
          alt={`Movie photo ${index + 1}`}
          layout="fill"
          objectFit="cover"
          className="rounded-lg absolute top-0 left-0 w-full h-full"
        />
      </div>
    ))}
  </div>
</div>
      </div>
    </div>
  );
};

export default MovieDetails;