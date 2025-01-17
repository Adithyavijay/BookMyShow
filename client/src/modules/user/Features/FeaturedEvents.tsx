import React from 'react';
import Image from 'next/image';
// Import images for static optimization at build time
import avengersImg from '@banners/avengers.png';
import filmFestivalImg from '@images/filmFestival.jpg';
import imaxImg from '@images/imax.jpg';
import { StaticImageData } from 'next/image';

// Types for our event data
interface Event {
  id: number;
  title: string;
  date: string;
  image: StaticImageData;  // Changed to StaticImageData type
  type: 'Premiere' | 'Festival' | 'Special';
}

// Featured Events Component
const FeaturedEvents = () => {
  // Mock data for events with imported images
  const events: Event[] = [
    {
      id: 1,
      title: "Avengers: Secret Wars Premiere",
      date: "Coming Soon",
      image: avengersImg,
      type: "Premiere"
    },
    {
      id: 2,
      title: "Film Festival 2025",
      date: "Feb 20-25",
      image: filmFestivalImg,
      type: "Festival"
    },
    {
      id: 3,
      title: "IMAX Special Screening",
      date: "This Weekend",
      image: imaxImg,
      type: "Special"
    }
  ];

  return (
    <div className="py-8 px-4 lg:px-24">
      <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div 
            key={event.id}
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image container with fixed aspect ratio */}
            <div className="relative w-full h-48">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority={event.id === 1} // Priority loading for first image
              />
            </div>
            {/* Overlay with event details */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-0 p-4 text-white">
                <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold bg-red-500 rounded">
                  {event.type}
                </span>
                <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                <p className="text-sm opacity-90">{event.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedEvents;