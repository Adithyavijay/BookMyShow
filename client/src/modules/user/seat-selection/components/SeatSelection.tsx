// components/SeatSelection.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import useRazorpay from '@/hooks/useRazorpay';
import toast, { Toaster } from 'react-hot-toast';

interface SeatSelectionProps {
  showtimeId: string;
  quantity: number;
}

interface Seat {
  seatNumber: string;
  isBooked: boolean;
}
declare global {
  interface Window {
    Razorpay: any;
  }
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ showtimeId, quantity }) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();
  const isRazorpayLoaded = useRazorpay();

  useEffect(() => {
    fetchSeats();
  }, [showtimeId]);

  const fetchSeats = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/user/seats/${showtimeId}`);
      setSeats(response.data[0].seats); 
      console.log(response.data)
      // Assuming the price is returned from the API. If not, you'll need to set it manually or fetch it separately.
      setTotalPrice(response.data[0].price || 100); // Default to 100 if price is not provided
    } catch (error) {
      console.error("Error fetching seats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeatClick = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else if (selectedSeats.length < quantity) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  }; 
  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      toast.error('Payment system is still loading. Please try again in a moment.');
      return;
    }

    setIsLoading(true);
    try {
      const orderResponse = await axios.post('http://localhost:5000/api/user/create-order', {
        amount: totalPrice * 100,
        showtimeId,
        seats: selectedSeats,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalPrice * quantity,
        currency: "INR",
        name: "Movie Ticket Booking",
        description: "Payment for movie tickets",
        order_id: orderResponse.data.orderId,
        handler: async function (response: any) {
          try {
            const verificationResponse = await axios.post('http://localhost:5000/api/user/verify-order', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              showtimeId,
              seats: selectedSeats, 
              amount : totalPrice * quantity,   
            });

            if (verificationResponse.data.success) {
              toast.success('Payment successful! Redirecting to confirmation page...');
              router.push(`/booking-confirmation/${verificationResponse.data.ticketId}`);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            alert('An error occurred during payment verification. Please contact support.');
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#F84464"
        } ,
        payment_methods: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('An error occurred while initiating payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSeats = () => {
    if (seats.length === 0) {
      return <div>No seats available</div>;
    }
    const rows = 'ABCDEFGHIJ';
    return rows.split('').map((row, rowIndex) => (
      <div key={row} className="flex mb-2 items-center">
        <div className="w-8 h-8 flex items-center justify-center text-sm font-semibold bg-gray-200 rounded-full mr-2">{row}</div>
        {[...Array(10)].map((_, colIndex) => {
          const seatNumber = `${row}${colIndex + 1}`;
          const seat = seats.find(s => s.seatNumber === seatNumber);
          const isSelected = selectedSeats.includes(seatNumber);
          const isDisabled = seat?.isBooked || false;

          return (
            <button
              key={seatNumber}
              className={`w-8 h-8 m-1 rounded-t-lg ${
                isDisabled ? 'bg-gray-300 cursor-not-allowed' :
                isSelected ? 'bg-green-500 text-white' : 'bg-blue-200 hover:bg-blue-300'
              } transition-colors duration-200 ease-in-out text-xs font-medium`}
              onClick={() => !isDisabled && handleSeatClick(seatNumber)}
              disabled={isDisabled}
            >
              {colIndex + 1}
            </button>
          );
        })}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  return (
    <div className="p-4 relative pb-20">
          <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-2xl font-bold mb-4">Select Your Seats</h2>
      <div className="mb-4">
        <p>Selected Seats: {selectedSeats.join(', ')}</p>
        <p>Remaining: {quantity - selectedSeats.length}</p>
      </div>
      <div className="flex justify-center mb-4">
        <div className="flex items-center mr-4">
          <div className="w-4 h-4 bg-blue-200 mr-2 rounded-t-lg"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center mr-4">
          <div className="w-4 h-4 bg-green-500 mr-2 rounded-t-lg"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 mr-2 rounded-t-lg"></div>
          <span>Booked</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {renderSeats()}
        <div className="w-4/5 h-8 bg-gradient-to-b from-gray-300 to-gray-100 rounded-t-3xl mt-8 mb-2 flex items-center justify-center">
          <div className="w-3/4 h-1 bg-gray-400"></div>
        </div>
        <div className="text-sm text-gray-600 mb-4">Screen</div>
      </div>
      {selectedSeats.length === quantity && (
        <div className="flex justify-center fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),_0_-2px_4px_-1px_rgba(0,0,0,0.06)]">
          <button 
            className=" px-16 flex justify-center items-center  bg-[#f84464] text-white py-2 rounded-lg font-semibold"
            onClick={handlePayment}
            disabled={isLoading || !isRazorpayLoaded}
            
          >
            Book {quantity} seats for ₹{totalPrice * quantity}
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;