import React from "react";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#333338] text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="flex flex-col items-center text-center">
                        <Image
                            src="/icons/customerCare.svg"
                            width={60}
                            height={60}
                            alt="customer care icon"
                            className="mb-4 hover:scale-110 transition-transform duration-300"
                        />
                        <span className="text-sm font-semibold tracking-wide">
                            24/7 CUSTOMER CARE
                        </span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <Image
                            src="/icons/BookingConfirmation.svg"
                            width={60}
                            height={60}
                            alt="booking confirmation icon"
                            className="mb-4 hover:scale-110 transition-transform duration-300"
                        />
                        <span className="text-sm font-semibold tracking-wide uppercase">
                            Resend Booking Confirmation
                        </span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <Image
                            src="/icons/newsLetter.svg"
                            width={60}
                            height={60}
                            alt="newsletter icon"
                            className="mb-4 hover:scale-110 transition-transform duration-300"
                        />
                        <span className="text-sm font-semibold tracking-wide uppercase">
                            Subscribe to the Newsletter
                        </span>
                    </div>
                </div>

                <div className="flex items-center my-12">
                    <div className="flex-grow h-px bg-gray-600"></div>
                    <div className="mx-4">
                        <Image src="/icons/bookmyshow.svg" width={180} height={30} alt="company logo" className="hover:opacity-80 transition-opacity duration-300"/>
                    </div>
                    <div className="flex-grow h-px bg-gray-600"></div>
                </div>

                <div className="flex justify-center mb-12">
                    <div className="flex space-x-8">
                        {[FaFacebook, FaInstagram, FaTwitter, FaLinkedin].map((Icon, index) => (
                            <a key={index} href="#" className="text-white hover:text-gray-300 transition-colors duration-300">
                                <Icon size={28} />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-600 pt-8">
                    <p className="text-gray-400 text-xs text-center leading-relaxed max-w-3xl mx-auto">
                        Copyright {new Date().getFullYear()} © Bigtree Entertainment Pvt. Ltd. All Rights Reserved.
                        <br /><br />
                        The content and images used on this site are copyright protected and copyrights vests with the respective owners. The usage of the content and images on this website is intended to promote the works and no endorsement of the artist shall be implied. Unauthorized use is prohibited and punishable by law.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;