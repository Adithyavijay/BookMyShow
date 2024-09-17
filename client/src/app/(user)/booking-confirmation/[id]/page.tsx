"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaWhatsapp, FaTicketAlt, FaQrcode } from "react-icons/fa";
import { MdEventSeat, MdMovie, MdTheaters } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

interface TicketInfo {
    movieName: string;
    theaterName: string;
    showDateTime: string;
    seats: string[];
    qrCode: string;
}

export default function BookingConfirmation({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();
    const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTicketInfo();
    }, [params.id]);

    const fetchTicketInfo = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/user/get-ticket/${params.id}`
            );
            setTicketInfo(response.data);
        } catch (error) {
            console.error("Error fetching ticket info:", error);
        }finally{
          setIsLoading(false);
        }
    };

    const handleWhatsappSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post("http://localhost:5000/api/user/send-whatsapp", {
                ticketId: params.id,
                whatsappNumber,
            });
            toast.success("Booking details sent to your WhatsApp!");
        } catch (error) {
            console.error("Error sending WhatsApp message:", error);
            toast.error("Failed to send WhatsApp message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!ticketInfo) {
        return (
            <div className="text-center py-10">
                <ClipLoader color="#ffffff" loading={isLoading} size={20} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-green-500 text-white py-4 px-6">
                        <h2 className="text-2xl font-bold">
                            Booking Confirmed!
                        </h2>
                        <p className="text-sm">Your movie tickets are ready</p>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <MdMovie className="text-3xl text-green-500 mr-3" />
                            <div>
                                <p className="font-semibold text-lg">
                                    {ticketInfo.movieName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {new Date(
                                        ticketInfo.showDateTime
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center mb-4">
                            <MdTheaters className="text-3xl text-green-500 mr-3" />
                            <p className="font-semibold">
                                {ticketInfo.theaterName}
                            </p>
                        </div>

                        <div className="flex items-center mb-4">
                            <MdEventSeat className="text-3xl text-green-500 mr-3" />
                            <p className="font-semibold">
                                Seats: {ticketInfo.seats.join(", ")}
                            </p>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Image
                                src={ticketInfo.qrCode}
                                alt="Ticket QR Code"
                                width={200}
                                height={200}
                            />
                        </div>

                        <p className="text-center mt-2 text-sm text-gray-600">
                            Show this QR code at the theater entrance
                        </p>
                    </div>

                    <div className="bg-gray-50 px-6 py-4">
                        <form
                            onSubmit={handleWhatsappSubmit}
                            className="flex items-center"
                        >
                            <input
                                type="tel"
                                placeholder="Enter WhatsApp number"
                                value={whatsappNumber}
                                onChange={(e) =>
                                    setWhatsappNumber(e.target.value)
                                }
                                className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                {isLoading ? (
                                    <ClipLoader
                                        color="#ffffff"
                                        loading={isLoading}
                                        size={20}
                                    />
                                ) : (
                                    <>
                                        <FaWhatsapp className="inline mr-2" />
                                        Send to WhatsApp
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push("/")}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Book Another Movie
                    </button>
                </div>
            </div>
        </div>
    );
}
