"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AddMovie from "./AddMovie";
import EditMovie from "./EditMovie";
import DeleteMovie from "./DeleteMovie";
import { toast, Toaster } from "react-hot-toast";

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

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const api = process.env.API_BASE_URL;
  const baseApi = process.env.BASE_URL;

  const fetchMovies = useCallback(async () => {
    try {
      const response = await axios.get<Movie[]>(`${api}/admin/movies`);
      setMovies(response.data);
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

  return (
    <div className="p-8 bg-gray-100">
      <Toaster />
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border rounded w-64"
        />
        <button
          onClick={() => setIsAddMovieOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Movie
        </button>
      </div>
      <table className="w-full bg-white shadow-md rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Poster</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Genre</th>
            <th className="p-3 text-left">Release Date</th>
            <th className="p-3 text-left">Director</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMovies.map((movie) => (
            <tr key={movie._id} className="border-b">
              <td className="p-3">
                <img
                  src={`http://localhost:5000${movie.poster}`}
                  alt={movie.title}
                  className="w-16 h-auto"
                />
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
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteModal(true);
                    setSelectedMovieId(movie._id);
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    </div>
  );
};

export default Movies;