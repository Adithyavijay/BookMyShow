import React from 'react';
import { IconType } from 'react-icons';
import malayalamFilms from '@images/malayalamFilms.jpg';
import worldCinema from '@images/Allofus.jpg';
import awardWinneers from '@images/Winners.webp';
import favourite from '@images/favouriteMovies.jpg'
import festiveFilms from '@images/filmFestival.jpg';
import imax from '@images/imax.jpg'

interface CollectionCard {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  stats?: string | string[];
  bgClass: string;
  imageUrl: string;
  span: string;
}
import Image from 'next/image';
import dynamic from 'next/dynamic';
// Import icons statically to reduce bundle size
import { 
  MdLocalMovies, 
  MdMovie, 
  MdTheaters 
} from 'react-icons/md';
import { 
  FaAward, 
  FaFilm, 
  FaHeart, 
  FaTheaterMasks 
} from 'react-icons/fa';
import { BiWorld } from 'react-icons/bi';

// Define card data for better maintainability
const collectionCards = [
  {
    id: 'malayalam',
    title: 'Malayalam Blockbusters',
    description: 'Neram • RDX • King of Kotha • Premalu • Manjummel Boys',
    icon: MdLocalMovies,
    stats: '15 Movies',
    bgClass: 'from-purple-500 to-indigo-600',
    imageUrl: malayalamFilms,
    span: 'col-span-2 row-span-2'
  },

  {
    id: 'world',
    title: 'World Cinema',
    description: 'Perfect Days • All of Us Strangers',
    icon: BiWorld,
    bgClass: 'from-pink-500 to-rose-600',
    imageUrl: worldCinema,
    span: 'col-span-2'
  },
  {
    id: 'awards',
    title: 'Award Winners 2024',
    description: 'Oppenheimer • Poor Things • The Zone of Interest',
    icon: FaAward,
    bgClass: 'from-yellow-400 to-amber-600',
    imageUrl: awardWinneers,
    span: ''
  },
  {
    id: 'festivals',
    title: 'Festival Picks',
    description: 'IFFK • Sundance • Berlinale 2024',
    icon: FaFilm,
    bgClass: 'from-blue-500 to-cyan-600',
    imageUrl: festiveFilms,
    span: ''
  },
  {
    id: 'theatre',
    title: 'Theatre Specials',
    description: 'Special IMAX & 4DX Screenings This Week',
    icon: FaTheaterMasks,
    stats: '6 Shows Today',
    bgClass: 'from-green-500 to-emerald-600',
    imageUrl: imax,
    span: 'col-span-2'
  },
  {
    id: 'favorites',
    title: 'Audience Picks',
    description: 'Top-rated movies by our community',
    icon: FaHeart,
    stats: ['4.8★ Average', '50K+ Ratings'],
    bgClass: 'from-red-500 to-orange-600',
    imageUrl: favourite,
    span: 'col-span-2'
  }
];

const MovieBento = () => {
  return (
    <div className="px-4 py-12 lg:px-24 bg-gray-50">
      <h2 className="text-2xl font-bold mb-8">Discover Collections</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[180px] gap-4 max-w-7xl mx-auto">
        {collectionCards.map((card) => {
          const Icon = card.icon;
          const isLarge = card.span.includes('row-span-2');
          
          return (
            <div 
              key={card.id}
              className={`${card.span} relative group overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgClass}`}
            >
              <Image 
                src={card.imageUrl}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover  opacity-40"
                loading="lazy"
                quality={75}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <Icon className={`${isLarge ? 'text-4xl mb-4' : 'text-3xl mb-3'}`} />
                <h3 className={`${isLarge ? 'text-2xl' : 'text-xl'} font-bold mb-2`}>
                  {card.title}
                </h3>
                <p className={`${isLarge ? 'text-sm' : 'text-xs'}`}>
                  {card.description}
                </p>
                {card.stats && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {Array.isArray(card.stats) ? (
                      card.stats.map((stat, index) => (
                        <span key={index} className="bg-white/20 px-2 py-1 rounded text-sm">
                          {stat}
                        </span>
                      ))
                    ) : (
                      <span className="bg-white/20 px-2 py-1 rounded text-sm">
                        {card.stats}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Enable component level code splitting
export default dynamic(() => Promise.resolve(MovieBento), {
  ssr: true, 
});