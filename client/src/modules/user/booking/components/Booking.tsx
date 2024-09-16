"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomDatePicker from "./CustomDatePicker";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import TicketQuantityModal from "./TicketQuantityModal";

interface Movie {
    _id: string;
    title: string;
    genre: string;
    language: String;
    certificate: String;
}

interface Theater {
    _id: string;
    name: string;
    location: String;
}

interface Showtime {
    _id: string;
    movie: Movie;

    theater: Theater;
    date: string;
    startTime: string;
    endTime: string;
    screenType: string;
    isCancellable: boolean;
    price: number;
    availableSeats: number;
}

interface BookingPageProps {
    id: string;
}

interface TicketModal {
  isOpen: boolean;
  showtimeId: string | null;
}

const BookingPage: React.FC<BookingPageProps> = ({ id }) => {
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [priceRange, setPriceRange] = useState("");
    const [showTimings, setShowTimings] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [ticketModal, setTicketModal] = useState<TicketModal>({ isOpen: false, showtimeId: null });
    const [isLoading,setIsLoading]=useState(true)
    const router=useRouter();

    useEffect(() => {
        fetchShowtimes();
    }, [id]);

    const fetchShowtimes = async () => {
      setIsLoading(true);
      try {
          const response = await axios.get(
              `http://localhost:5000/api/user/showtimes/${id}`
          );
          setShowtimes(response.data.showtimes);
      } catch (error) {
          console.error("Error fetching showtimes:", error);
      } finally {
          setIsLoading(false);
      }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <ClipLoader color="#4A90E2" size={50} />
        </div>
    );
}

    const filterShowtimes = (showtime: Showtime) => {
        const showtimeDate = new Date(showtime.date);
        const time = new Date(showtime.startTime).getHours();
        const price = showtime.price;

        let dateMatch =
            showtimeDate.toDateString() === selectedDate.toDateString();

        let timeMatch = true;
        if (showTimings === "morning") timeMatch = time >= 6 && time < 12;
        else if (showTimings === "afternoon")
            timeMatch = time >= 12 && time < 17;
        else if (showTimings === "evening") timeMatch = time >= 17 && time < 21;
        else if (showTimings === "night") timeMatch = time >= 21 || time < 6;

        let priceMatch = true;
        if (priceRange === "0-100") priceMatch = price <= 100;
        else if (priceRange === "100-200")
            priceMatch = price > 100 && price <= 200;
        else if (priceRange === "200+") priceMatch = price > 200;

        return dateMatch && timeMatch && priceMatch;
    };

    const groupShowtimesByTheater = (showtimes: Showtime[]) => {
        const grouped = showtimes.reduce((acc, showtime) => {
            if (filterShowtimes(showtime)) {
                const theaterId = showtime.theater._id;
                if (!acc[theaterId]) {
                    acc[theaterId] = {
                        theater: showtime.theater,
                        showtimes: [],
                    };
                }
                acc[theaterId].showtimes.push(showtime);
            }
            return acc;
        }, {} as Record<string, { theater: Theater; showtimes: Showtime[] }>);

        // Remove theaters with no showtimes
        return Object.fromEntries(
            Object.entries(grouped).filter(
                ([_, value]) => value.showtimes.length > 0
            )
        );
    };

    const groupedShowtimes = groupShowtimesByTheater(showtimes);

    if (showtimes.length === 0) return <div>Loading...</div>;

    const movie = showtimes[0].movie; // Get movie details from the first showtime
    const filteredGroupedShowtimes = Object.values(groupedShowtimes).filter(
        (group) =>
            group.theater.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTimingLabel = (timing: string) => {
        switch (timing) {
            case "morning":
                return "Morning (6 AM - 11:59 AM)";
            case "afternoon":
                return "Afternoon (12 PM - 4:59 PM)";
            case "evening":
                return "Evening (5 PM - 8:59 PM)";
            case "night":
                return "Night (9 PM - 5:59 AM)";
            default:
                return "All Timings";
        }
    }; 

    const handleShowtimeClick = (showtimeId: string) => {
      setTicketModal({ isOpen: true, showtimeId });
    };
  
    const handleTicketQuantitySubmit = (quantity: number) => {
      if (ticketModal.showtimeId) {
        router.push(`/seats/${ticketModal.showtimeId}?quantity=${quantity}`);
      }
    };
  
    const handleCloseModal = () => {    
      setTicketModal({ isOpen: false, showtimeId: null });
    };
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl px-20 font-medium mb-2">
                {movie.title} - {movie.language}
            </h1>
            <div className="text-gray-600 px-20 mb-6 flex items-center">
                <span className="border border-gray-300 rounded-full text-center mr-3 px-2 py-1 uppercase text-xs font-semibold inline-flex items-center justify-center min-w-[30px] min-h-[30px] bg-gray-100">
                    {movie.certificate}
                </span>
                <span className="border border-gray-300 text-sm px-3 py-1 rounded-full bg-gray-100">
                    {movie.genre}
                </span>
            </div>
            <div className="w-full h-[1px] bg-gray-300 my-2"></div>

            <div className="flex px-20 justify-between items-center space-y-4 mb-6">
                <CustomDatePicker
                    selectedDate={selectedDate}
                    onChange={setSelectedDate}
                />
                <div className="flex space-x-4">
                    <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">Filter Price Range</option>
                        <option value="0-100">₹0 - ₹100</option>
                        <option value="100-200">₹100 - ₹200</option>
                        <option value="200+">₹200+</option>
                    </select>
                    <select
                        value={showTimings}
                        onChange={(e) => setShowTimings(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">{getTimingLabel("")}</option>
                        <option value="morning">
                            {getTimingLabel("morning")}
                        </option>
                        <option value="afternoon">
                            {getTimingLabel("afternoon")}
                        </option>
                        <option value="evening">
                            {getTimingLabel("evening")}
                        </option>
                        <option value="night">{getTimingLabel("night")}</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search theaters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 rounded"
                    />
                </div>
            </div>
            <div className="bg-[#f2f2f2] py-10 px-20">
         { filteredGroupedShowtimes.length>0 ? ( <div className="px-2 mb-4 flex items-center">
        <span className="mr-4 flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Available
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          Not Available
        </span>
      </div> ) : ("")}  
                {filteredGroupedShowtimes.length > 0 ? (
                    filteredGroupedShowtimes.map(({ theater, showtimes }) => (
                        <div
                            key={theater._id}
                            className="mb-8 bg-white rounded-lg overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-lg font-semibold">
                                    {theater.name}, {theater.location}
                                </h2>
                            </div>
                            <div className="p-6 flex flex-wrap gap-4">
                                {showtimes.map((showtime) => (
                                    <button 
                                    onClick={() => handleShowtimeClick(showtime._id)}
                                        key={showtime._id}
                                        className={`px-4 py-2 border rounded text-center ${
                                            showtime.availableSeats > 0
                                                ? "bg-green-100 hover:bg-green-200"
                                                : "bg-red-100 hover:bg-red-200"
                                        }`}
                                        disabled={showtime.availableSeats === 0}
                                    >
                                        <div>
                                            {new Date(
                                                showtime.startTime
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                        <div className="text-xs">
                                            ₹{showtime.price}
                                        </div>
                                        <div className="text-xs">
                                            {showtime.availableSeats} seats
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="px-6 py-2 text-sm text-gray-500">
                                {showtimes[0].isCancellable
                                    ? "Cancellation Available"
                                    : "Non-cancellable"}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        No showtimes available for the selected filters.
                    </div>
                )}
            </div>
            {ticketModal.isOpen && (
        <TicketQuantityModal
          onClose={handleCloseModal}
          onSubmit={handleTicketQuantitySubmit}
        />
      )}
        </div>
    );
};

export default BookingPage;
