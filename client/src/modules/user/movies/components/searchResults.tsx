// components/SearchResults.tsx
import React from 'react';
import { Movie } from  '../types/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SearchResultsProps {
  movies: Movie[];
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ movies, onClose }) => {
  const router = useRouter();

  const handleMovieClick = (movieId: string) => {
    router.push(`/movie/${movieId}`);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg max-h-96 overflow-y-auto z-50">
      {movies.length === 0 ? (
        <p className="p-4 text-gray-500">No movies found</p>
      ) : (
        movies.map((movie) => (
          <div
            key={movie._id}
            className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleMovieClick(movie._id)}
          >
            <Image
              src={`http://localhost:5000${movie.poster}`}
              alt={movie.title}
              width={50}
              height={75}
              className="object-cover rounded"
            />
            <div className="ml-4">
              <h3 className="font-semibold">{movie.title}</h3>
              <p className="text-sm text-gray-600">{movie.genre}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;