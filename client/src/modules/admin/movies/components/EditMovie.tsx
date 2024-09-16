'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddCast from './AddCast';
import { MovieFormData, CastMember, Theater } from '../types/types';

interface EditMovieProps {
  isOpen: boolean;
  onClose: () => void;
  onEditMovie: (movie: MovieFormData) => void;
  movieId: string;
}

const EditMovie: React.FC<EditMovieProps> = ({ isOpen, onClose, onEditMovie, movieId }) => {
  const [formData, setFormData] = useState<MovieFormData>({
    title: '',
    description: '',
    duration: '',
    genre: '',
    language: '',
    releaseDate: '',
    cast: [],
    theaters: [],
    director: '',
    poster: null,
    photos: [],
    certificate: '',
  }); 
  

  const [isAddCastOpen, setIsAddCastOpen] = useState(false);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const api = process.env.API_BASE_URL;
  const URL = process.env.BASE_URL;
  
  useEffect(() => {
    if (isOpen && movieId) {
      fetchMovieData();
      fetchTheaters();
    }
  }, [isOpen, movieId]);

  const fetchMovieData = async () => {
    try {
      const response = await axios.get(`${api}/admin/movies/${movieId}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const fetchTheaters = async () => {
    try {
      const response = await axios.get(`${api}/admin/get-theaters`);
      setTheaters(response.data.theaters);
    } catch (error) {
      console.error('Error fetching theaters:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      if (name === 'poster') {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      } else if (name === 'photos') {
        setFormData(prev => ({ ...prev, [name]: Array.from(files) }));
      }
    }
  };

  const handleTheaterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const theaterId = e.target.value;
    setFormData(prev => {
      if (e.target.checked) {
        return { ...prev, theaters: [...prev.theaters, theaterId] };
      } else {
        return { ...prev, theaters: prev.theaters.filter(id => id !== theaterId) };
      }
    });
  };

  const handleAddCast = (castMembers: CastMember[]): void => {
    setFormData(prev => ({ ...prev, cast: castMembers }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditMovie(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-bold p-4 border-b">Edit Movie</h2>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-4">
          {[
            { name: 'title', label: 'Title', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'duration', label: 'Duration (in minutes)', type: 'number' },
            { name: 'genre', label: 'Genre', type: 'text' },
            { name: 'language', label: 'Language', type: 'text' },
            { name: 'releaseDate', label: 'Release Date', type: 'date' },
            { name: 'director', label: 'Director', type: 'text' },
            { name: 'certificate', label: 'Certificate', type: 'text' },
          ].map((field) => (
            <div key={field.name} className="mb-4">
              <label htmlFor={field.name} className="block mb-2 font-bold">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name as keyof MovieFormData] as string}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name as keyof MovieFormData] as string}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              )}
            </div>
          ))}

          <button
            onClick={() => setIsAddCastOpen(true)}
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 mb-4"
          >
            Edit Cast
          </button>

          <AddCast
            isOpen={isAddCastOpen}
            onClose={() => setIsAddCastOpen(false)}
            onAddCast={handleAddCast}
            initialCast={formData.cast}
          />


          <div className="mb-4">
            <label htmlFor='theaters' className='block mb-2 font-bold'>Theatres</label>
            {theaters.map(theater => (
              <div key={theater._id} className='flex mb-2'>
                <input
                  type="checkbox"
                  value={theater._id}
                  checked={formData.theaters.includes(theater._id)}
                  onChange={handleTheaterChange}
                  className='mr-2'
                />
                <label htmlFor={`theater-${theater._id}`}>{theater.name}</label>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label htmlFor="poster" className="block mb-2 font-bold">Poster</label>
            <input
              type="file"
              id="poster"
              name="poster"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-2 border rounded"
            />
            {formData.poster && typeof formData.poster === 'string' && (
              <img src={`http://localhost:5000${formData.poster}`} alt="Current poster" className="mt-2 w-32 h-auto" />
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="photos" className="block mb-2 font-bold">Photos</label>
            <input
              type="file"
              id="photos"
              name="photos"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="w-full p-2 border rounded"
            />
            {formData.photos && formData.photos.length > 0 && (
              <div className="mt-2 flex flex-wrap">
                {formData.photos.map((photo, index) => (
                  typeof photo === 'string' && (
                    <img key={index} src={"http://localhost:5000"+photo} alt={`Movie photo ${index + 1}`} className="w-16 h-16 object-cover m-1" />
                  )
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end p-4 border-t">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">Update Movie</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovie;