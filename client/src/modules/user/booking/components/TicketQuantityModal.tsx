import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

interface TicketQuantityModalProps {
    onClose: () => void;
    onSubmit: (quantity: number) => void;
}

const TicketQuantityModal: React.FC<TicketQuantityModalProps> = ({
    onClose,
    onSubmit,
}) => {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
             
                <h2 className="text-2xl font-bold mb-6 text-center">
                    How many seats?
                </h2>
                <div className="flex justify-center mb-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleQuantityChange(num)}
                            className={`w-10 h-10 mx-1 rounded-full flex items-center justify-center text-lg font-semibold
                ${
                    quantity === num
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
                <div className="text-center mb-6">
                    <p className="text-lg font-semibold">
                        {quantity} {quantity === 1 ? "Ticket" : "Tickets"}
                    </p>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={() => onSubmit(quantity)}
                        className="px-8 py-3 bg-red-500 text-white rounded-full text-lg font-semibold hover:bg-red-600 transition duration-300"
                    >
                        Select Seats
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill=""
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TicketQuantityModal;
