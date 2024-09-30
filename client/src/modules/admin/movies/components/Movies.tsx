"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AddMovie from "./AddMovie";
import EditMovie from "./EditMovie";
import DeleteMovie from "./DeleteMovie";
import { toast, Toaster } from "react-hot-toast";
import MovieDetails from "./MovieDetails";
import { api } from "@/utils/api";
import Image from 'next/image';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaChevronLeft, FaChevronRight ,FaEye} from 'react-icons/fa';

interface Movie {
  _id: string;
  title: string;
  genre: string;
  releaseDate: number;
  director: string;
  poster: string;
  photos: string[];
}

interface MovieFormData {
  [key: string]: any;
  cast?: { castName: string; castPhoto: File | null }[];
} 

interface ApiResponse<T> {
  data : T ;
  status : boolean ;
  message : string;
}

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(2);
  const [showDetailsModal, setShowDetailsModal] = useState(false);



  const fetchMovies = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<Movie[]>>(`/user/movies`);
      setMovies(response.data.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to fetch movies");
    }
  }, [api]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const createFormData = (movieData: MovieFormData): FormData => {
    const formData = new FormData();
    Object.entries(movieData).forEach(([key, value]) => {
      if (key === "photos" && Array.isArray(value)) {
        value.forEach((photo: File) => formData.append("photos", photo));
      } else if (key === "theaters") {
        formData.append(key, JSON.stringify(value));
      } else if (key !== "cast") {
        formData.append(key, value);
      }
    });

    if (movieData.cast) {
      const castNames = movieData.cast.map((member) => member.castName);
      formData.append("castNames", JSON.stringify(castNames));
      movieData.cast.forEach((member, index) => {
        if (member.castPhoto) {
          formData.append(`castPhoto${index}`, member.castPhoto);
        }
      });
    }

    return formData;
  };

  const handleAddMovie = async (movieData: MovieFormData) => {
    try {
      const formData = createFormData(movieData);
      const response = await axios.post(`${api}/admin/movies`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        fetchMovies();
        setIsAddMovieOpen(false);
        toast.success("Movie added successfully");
      }
    } catch (error) {
      console.error("Error adding movie:", error);
      toast.error("Failed to add movie");
    }
  };

  const handleEditMovie = async (movieData: MovieFormData, movieId: string) => {
    try {
      const formData = createFormData(movieData);
      const response = await axios.put(
        `${api}/admin/update-movies/${movieId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        fetchMovies();
        setEditModal(false);
        toast.success("Movie updated successfully");
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error("Failed to update movie");
    }
  };

  const handleDelete = async () => {
    await fetchMovies();
    toast.success("Movie deleted");
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-gradient-to-br from-purple-100 to-indigo-100 min-h-screen">
      <Toaster />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">Movies Management</h1>
        <div className="flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={handleSearch}
              className="p-2 pl-10 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setIsAddMovieOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out flex items-center"
          >
            <FaPlus className="mr-2" /> Add Movie
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Photo</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Genre</th>
              <th className="p-3 text-left">Release Date</th>
              <th className="p-3 text-left">Director</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMovies.map((movie) => (
              <tr key={movie._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="relative w-24 h-28 overflow-hidden rounded-lg">
                    <Image
                      src={`http://localhost:5000${movie.photos[0] || movie.poster}`}
                      alt={movie.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </td>
                <td className="p-3">{movie.title}</td>
                <td className="p-3">{movie.genre}</td>
                <td className="p-3">{movie.releaseDate}</td>
                <td className="p-3">{movie.director}</td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      setEditModal(true);
                      setSelectedMovieId(movie._id);
                    }}
                    className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition duration-300 ease-in-out mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteModal(true);
                      setSelectedMovieId(movie._id);
                    }}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 ease-in-out"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMovieId(movie._id);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 ml-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                currentPage === index + 1 ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FaChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
      {isAddMovieOpen && (
        <AddMovie
          isOpen={isAddMovieOpen}
          onClose={() => setIsAddMovieOpen(false)}
          onAddMovie={handleAddMovie}
        />
      )}
      {editModal && selectedMovieId && (
        <EditMovie
          isOpen={editModal}
          onClose={() => setEditModal(false)}
          onEditMovie={(updatedData) =>
            handleEditMovie(updatedData, selectedMovieId)
          }
          movieId={selectedMovieId}
        />
      )}
      {deleteModal && selectedMovieId && (
        <DeleteMovie
          onClose={() => setDeleteModal(false)}
          movieTitle={
            movies.find((movie) => movie._id === selectedMovieId)?.title || ""
          }
          movieId={selectedMovieId}
          onDeleteSuccess={handleDelete}
        />
      )}

{showDetailsModal && selectedMovieId && (
        <MovieDetails
          movieId={selectedMovieId}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default Movies;