// components/EditShowtime.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { toast ,Toaster } from 'react-hot-toast';

interface EditShowtimeProps {
  onClose: () => void;
  showtimeId: string;
  onUpdate: () => void;
}

interface Movie {
  _id: string;
  title: string;
  theaters: Theater[];
  duration: number;
}

interface Theater {
  _id: string;
  name: string;
}

interface Showtime {
  _id: string;
  movie: Movie;
  theater: Theater;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  screenType: '2D' | '3D';
  isCancellable: boolean;
}

const TIME_SLOTS = [
  { label: 'Morning (9:00 AM - 11:59 AM)', start: '09:00', end: '11:59' },
  { label: 'Afternoon (12:00 PM - 3:59 PM)', start: '12:00', end: '15:59' },
  { label: 'Evening (4:00 PM - 7:59 PM)', start: '16:00', end: '19:59' },
  { label: 'Night (8:00 PM - 11:59 PM)', start: '20:00', end: '23:59' },
];

const EditShowtime: React.FC<EditShowtimeProps> = ({ onClose, showtimeId, onUpdate }) => {
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTheaters, setAvailableTheaters] = useState<Theater[]>([]);
  const [existingShowtimes, setExistingShowtimes] = useState<any[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const api = process.env.API_BASE_URL;

  useEffect(() => {
    fetchShowtime();
    fetchMovies();
  }, [showtimeId]);

  useEffect(() => {
    if (showtime && showtime.movie) {
      const selectedMovie = movies.find(m => m._id === showtime.movie._id);
      if (selectedMovie) {
        setAvailableTheaters(selectedMovie.theaters);
        fetchExistingShowtimes(selectedMovie._id, showtime.theater._id, showtime.date);
      }
    }
  }, [showtime, movies]);

  const fetchShowtime = async () => {
    try {
      const response = await axios.get(`${api}/admin/showtimes/${showtimeId}`);
      setShowtime(response.data.data);
      setSelectedTimeSlot(getTimeSlotFromTime(response.data.data.startTime));
    } catch (error) {
      console.error('Error fetching showtime:', error);
      toast.error('Failed to fetch showtime details');
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${api}/admin/movies`);
      setMovies(response.data.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingShowtimes = async (movieId: string, theaterId: string, date: string) => {
    try { 
      const response = await axios.get(`${api}/admin/showtimes-check`, {
        params: { movieId, theaterId, date }
      });
      setExistingShowtimes(response.data.data.filter((s: any) => s._id !== showtimeId));
    } catch (err) {
      console.error("Error fetching existing showtimes:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'theater') {
      const selectedTheater = availableTheaters.find(t => t._id === value);
      setShowtime(prev => prev ? { ...prev, theater: selectedTheater || { _id: value, name: '' } } : null);
    } else if (name === 'date') {
      setShowtime(prev => prev ? { ...prev, [name]: value } : null);
      if (showtime) {
        fetchExistingShowtimes(showtime.movie._id, showtime.theater._id, value);
      }
    } else {
      setShowtime(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleMovieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const movieId = e.target.value;
    const selectedMovie = movies.find(m => m._id === movieId);
    if (selectedMovie && showtime) {
      setShowtime({
        ...showtime,
        movie: selectedMovie,
        theater: { _id: '', name: '' }
      });
      setAvailableTheaters(selectedMovie.theaters);
      fetchExistingShowtimes(movieId, '', showtime.date);
    }
  };

  const handleTimeSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slot = TIME_SLOTS.find(slot => slot.label === e.target.value);
    if (slot && showtime) {
      setSelectedTimeSlot(e.target.value);
      setShowtime({
        ...showtime,
        startTime: slot.start,
        endTime: calculateEndTime(slot.start, showtime.movie.duration)
      });
    }
  };

  const calculateEndTime = (start: string, duration: number) => {
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    return endDate.toTimeString().slice(0, 5);
  };

  const getTimeSlotFromTime = (time: string) => {
    const slot = TIME_SLOTS.find(slot => time >= slot.start && time <= slot.end);
    return slot ? slot.label : '';
  };

  const isTimeSlotAvailable = (slot: typeof TIME_SLOTS[0]) => {
    if (!existingShowtimes.length) return true;
    
    const now = new Date();
    const slotStart = new Date(`${showtime?.date}T${slot.start}`);
    const slotEnd = new Date(`${showtime?.date}T${slot.end}`);
    
    if (showtime?.date === getTodayDate() && slotEnd <= now) {
      return false;
    }
    
    return !existingShowtimes.some(existingShowtime => {
      const existingStart = new Date(existingShowtime.startTime);
      const existingEnd = new Date(existingShowtime.endTime);
      return (
        (slotStart >= existingStart && slotStart < existingEnd) ||
        (slotEnd > existingStart && slotEnd <= existingEnd) ||
        (slotStart <= existingStart && slotEnd >= existingEnd)
      );
    });
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!showtime) return;
  
    try {
      const formattedShowtime = {
        ...showtime,
        movie: showtime.movie._id,
        theater: showtime.theater._id,
        date: new Date(showtime.date).toISOString().split('T')[0],
        startTime: showtime.startTime,
        endTime: showtime.endTime,
      };
  
      const response = await axios.put(`${api}/admin/showtimes/${showtimeId}`, formattedShowtime);
      if (response.status === 200) {
        toast.success('Showtime updated successfully');
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Error updating showtime:', error);
      toast.error('Failed to update showtime');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <ClipLoader color="#ffffff" size={50} />
      </div>
    );
  }

  if (!showtime) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
        <Toaster />
      <div className="my-8 mx-auto bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <h2 className="text-xl font-semibold mb-4">Edit Showtime</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
            {/* Movie Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="movie" className="font-medium text-sm mb-1">Movie</label>
              <select
                id="movie"
                name="movie"
                value={showtime.movie._id}
                onChange={handleMovieChange}
                className="border rounded-md px-3 py-2"
              >
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Theater Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="theater" className="font-medium text-sm mb-1">Theater</label>
              <select
                id="theater"
                name="theater"
                value={showtime.theater._id}
                onChange={handleChange}
                className="border rounded-md px-3 py-2"
              >
                <option value="">Select a theater</option>
                {availableTheaters.map((theater) => (
                  <option key={theater._id} value={theater._id}>
                    {theater.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Input */}
            <div className="flex flex-col">
              <label htmlFor="date" className="font-medium text-sm mb-1">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={showtime.date}
                onChange={handleChange}
                min={getTodayDate()}
                className="border rounded-md px-3 py-2"
              />
            </div>

            {/* Time Slot Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="timeSlot" className="font-medium text-sm mb-1">Time Slot</label>
              <select
                id="timeSlot"
                value={selectedTimeSlot}
                onChange={handleTimeSlotChange}
                className="border rounded-md px-3 py-2"
              >
                <option value="">Select Time Slot</option>
                {TIME_SLOTS.map((slot, index) => (
                  <option 
                    key={index} 
                    value={slot.label}
                    disabled={!isTimeSlotAvailable(slot)}
                  >
                    {slot.label} {!isTimeSlotAvailable(slot) && '(Not Available)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time Display */}
            <div className="flex flex-col">
              <label htmlFor="startTime" className="font-medium text-sm mb-1">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={showtime.startTime}
                readOnly
                className="border rounded-md px-3 py-2 bg-gray-100"
              />
            </div>

            {/* End Time Display */}
            <div className="flex flex-col">
              <label htmlFor="endTime" className="font-medium text-sm mb-1">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={showtime.endTime}
                readOnly
                className="border rounded-md px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Price Input */}
            <div className="flex flex-col">
              <label htmlFor="price" className="font-medium text-sm mb-1">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={showtime.price}
                onChange={handleChange}
                className="border rounded-md px-3 py-2"
              />
            </div>

            {/* Screen Type Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="screenType" className="font-medium text-sm mb-1">Screen Type</label>
              <select
                id="screenType"
                name="screenType"
                value={showtime.screenType}
                onChange={handleChange}
                className="border rounded-md px-3 py-2"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
              </select>
            </div>

            {/* Cancellable Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isCancellable"
                name="isCancellable"
                checked={showtime.isCancellable}
                onChange={(e) => setShowtime(prev => prev ? { ...prev, isCancellable: e.target.checked } : null)}
                className="mr-2"
              />
              <label htmlFor="isCancellable" className="font-medium text-sm">Cancellable</label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 flex justify-center items-center"
            >
              {isSubmitting ? <ClipLoader color="#ffffff" size={20} /> : 'Update Showtime'}
            </button>
          </form>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-4 text-sm text-red-500 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditShowtime;