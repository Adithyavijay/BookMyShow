import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';
import { adminApi } from '@/utils/api';

interface AddShowTimeProps {
  onClose: () => void;
  onSuccess: ()=>void;
}

interface Movie {
  _id: string;
  title: string;
  theaters: Theater[];
  duration: number; // Duration in minutes
}

interface Theater {
  _id: string;
  name: string;
}

type ScreenType = '2D' | '3D';
type CancellationType = 'Cancellation Available' | 'Non-Cancellable';

const TIME_SLOTS = [
  { label: 'Morning (9:00 AM - 11:59 AM)', start: '09:00', end: '11:59' },
  { label: 'Afternoon (12:00 PM - 3:59 PM)', start: '12:00', end: '15:59' },
  { label: 'Evening (4:00 PM - 7:59 PM)', start: '16:00', end: '19:59' },
  { label: 'Night (8:00 PM - 11:59 PM)', start: '20:00', end: '23:59' },
];


const AddShowtime: React.FC<AddShowTimeProps> = ({ onClose ,onSuccess}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [price, setPrice] = useState('');
  const [screenType, setScreenType] = useState<ScreenType>('2D');
  const [cancellable, setCancellable] = useState<CancellationType>('Cancellation Available');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingShowtimes, setExistingShowtimes] = useState<any[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [MinDate,setMinDate]=useState('')

  const api = process.env.API_BASE_URL ;
  useEffect(() => {
    fetchMovies();
    setMinDate(getTodayDate());
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (selectedMovie && selectedTheater && date) {
      fetchExistingShowtimes();
    }
  }, [selectedMovie, selectedTheater, date]);

  const fetchExistingShowtimes = async () => {
    try {
      const response = await adminApi.get(`/showtimes-check`, {
        params: { movieId: selectedMovie?._id, theaterId: selectedTheater, date }
      });
      setExistingShowtimes(response.data.data);
    } catch (err) {
      console.error("Error fetching existing showtimes:", err);
    } 
  };
  

  const handleTimeSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slot = TIME_SLOTS.find(slot => slot.label === e.target.value);
    if (slot) {
      setSelectedTimeSlot(e.target.value);
      setStartTime(slot.start);
      calculateEndTime(slot.start);
    }
  };

  const calculateEndTime = (start: string) => {
    if (selectedMovie && date && start) {
      const startDateTime = new Date(`${date}T${start}`);
      const endDateTime = new Date(startDateTime.getTime() + selectedMovie.duration * 60000);
      setEndTime(endDateTime.toTimeString().slice(0, 5));
    }
  };


  const isTimeSlotAvailable = (slot: typeof TIME_SLOTS[0]) => {
    if (!existingShowtimes.length) return true;
    
    const now = new Date();
    const slotStart = new Date(`${date}T${slot.start}`);
    const slotEnd = new Date(`${date}T${slot.end}`);
    
    // Check if the slot is in the past for today's date
    if (date === getTodayDate() && slotEnd <= now) {
      return false;
    }
    
    return !existingShowtimes.some(showtime => {
      const showtimeStart = new Date(showtime.startTime);
      const showtimeEnd = new Date(showtime.endTime);
      return (
        (slotStart >= showtimeStart && slotStart < showtimeEnd) ||
        (slotEnd > showtimeStart && slotEnd <= showtimeEnd) ||
        (slotStart <= showtimeStart && slotEnd >= showtimeEnd)
      );
    });
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get(`/movies`);
      setMovies(response.data.data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const movieId = e.target.value;
    const movie = movies.find(m => m._id === movieId) || null;
    setSelectedMovie(movie);
    setSelectedTheater('');
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const showtimeData = {
      movie: selectedMovie?._id,
      theater: selectedTheater,
      date,
      startTime: new Date(`${date}T${startTime}`).toISOString(),
      endTime: new Date(`${date}T${endTime}`).toISOString(),
      price,
      screenType,
      isCancellable: cancellable === 'Cancellation Available'
    };
      try {
      const response = await adminApi.post(`/add-showtime`, showtimeData);
      console.log(response);
      if (response.status === 201) { 
        onSuccess();
        toast.success('Showtime added successfully');
        onClose();
      } else {
        toast.error('Failed to add showtime');
      }
    } catch (err) {
      console.log(err);
      toast.error('An error occurred while adding the showtime');
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

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto'>
      <div className='my-8 mx-auto bg-white rounded-lg shadow-lg max-w-md w-full'>
        <div className='p-6 overflow-y-auto max-h-[calc(100vh-4rem)]'>
          <h2 className='text-xl font-semibold mb-4'>Add Showtime</h2>
          <form onSubmit={handleSubmit} className='flex flex-col gap-y-4'>
            {/* Movie Dropdown */}
            <div className='flex flex-col'>
              <label htmlFor="movie" className='font-medium text-sm mb-1'>Select Movie</label>
              <select
                id="movie"
                value={selectedMovie?._id || ''}
                onChange={handleMovieChange}
                className='border rounded-md px-3 py-2'>
                <option value="">Select Movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Theater Dropdown */}
            <div className='flex flex-col'>
              <label htmlFor="theater" className='font-medium text-sm mb-1'>Select Theater</label>
              <select
                id="theater"
                value={selectedTheater}
                onChange={(e) => setSelectedTheater(e.target.value)}
                className='border rounded-md px-3 py-2'
                disabled={!selectedMovie}>
                <option value="">Select Theater</option>
                {selectedMovie?.theaters.map((theater) => (
                  <option key={theater._id} value={theater._id}>
                    {theater.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className='flex flex-col'>
              <label htmlFor="date" className='font-medium text-sm mb-1'>Select Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getTodayDate()} // Set minimum date to today
                className='border rounded-md px-3 py-2' />
            </div>

            {/* Start Time Picker */}
            <div className='flex flex-col'>
              <label htmlFor="timeSlot" className='font-medium text-sm mb-1'>Select Time Slot</label>
              <select
                id="timeSlot"
                value={selectedTimeSlot}
                onChange={handleTimeSlotChange}
                className='border rounded-md px-3 py-2'
                disabled={!selectedMovie || !selectedTheater || !date}>
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
            <div className='flex flex-col'>
              <label htmlFor="startTime" className='font-medium text-sm mb-1'>Start Time</label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                readOnly
                className='border rounded-md px-3 py-2 bg-gray-100' />
            </div>

            {/* End Time Display */}
            <div className='flex flex-col'>
              <label htmlFor="endTime" className='font-medium text-sm mb-1'>End Time</label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                readOnly
                className='border rounded-md px-3 py-2 bg-gray-100' />
            </div>


            {/* Screen Type Selection */}
            <div className='flex flex-col'>
              <label htmlFor="screenType" className='font-medium text-sm mb-1'>Screen Type</label>
              <select
                id="screenType"
                value={screenType}
                onChange={(e) => setScreenType(e.target.value as ScreenType)}
                className='border rounded-md px-3 py-2'>
                <option value="2D">2D</option>
                <option value="3D">3D</option>
              </select>
            </div>

            {/* Cancellable Dropdown */}
            <div className='flex flex-col'>
              <label htmlFor="cancellable" className='font-medium text-sm mb-1'>Cancellation Option</label>
              <select
                id="cancellable"
                value={cancellable}
                onChange={(e) => setCancellable(e.target.value as CancellationType)}
                className='border rounded-md px-3 py-2'>
                <option value="Cancellation Available">Cancellation Available</option>
                <option value="Non-Cancellable">Non-Cancellable</option>
              </select>
            </div>

            {/* Price Input */}
            <div className='flex flex-col'>
              <label htmlFor="price" className='font-medium text-sm mb-1'>Ticket Price</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className='border rounded-md px-3 py-2' />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedTimeSlot}
              className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 flex justify-center items-center disabled:bg-gray-400'
            >
              {isSubmitting ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                'Submit'
              )}
            </button>
          </form>

          {/* Close Button */}
          <button
            onClick={onClose}
            className='mt-4 text-sm text-red-500 hover:underline'>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddShowtime;