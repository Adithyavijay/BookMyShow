'use client'
import React, { useEffect, useState } from 'react';
import { Movie, Review } from '@/modules/user/movies/types/types';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { userState } from '@/atoms/modalAtom';

interface MovieDetailProps {
   id: string
}

const MovieDetail: React.FC<MovieDetailProps> = ({ id }) => {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userReview, setUserReview] = useState('');
    const [userRating, setUserRating] = useState(0);
    const router = useRouter();
    const user = useRecoilValue(userState);

    useEffect(() => {
        fetchMovie();
    }, []);

    const fetchMovie = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/movie/${id}`);
           
            setMovie(response.data.data);
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    }
    
    const handleBookTickets = () => {
        router.push(`/booking/${id}`);
    };

    const handleSubmitReview = async () => {
        if (!user) {
            alert("Please log in to submit a review.");
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/user/movie/${id}/review`, {
                text: userReview,
                rating: userRating,
                userId: user.id
            });
            fetchMovie(); // Refresh movie data
            setShowReviewForm(false);
            setUserReview('');
            setUserRating(0);
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    if (!movie) return <div>Loading...</div>; 

    return (
        <div>
            {/* Hero Section with Poster and Details */}
            <div className="relative h-[70vh]">
                <div className="absolute inset-0 bg-cover bg-center z-0" style={{backgroundImage: `url(http://localhost:5000${movie.poster})`, filter: 'blur(5px) brightness(0.3)'}}></div>
                
                <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
                    <div className="flex flex-col md:flex-row gap-8 items-center max-w-6xl w-full">
                        {/* Movie Poster */}
                        <div className="md:w-1/3 flex justify-center">
                            <Image 
                                src={`http://localhost:5000${movie.poster}`} 
                                alt={movie.title} 
                                width={300} 
                                height={450} 
                                className="rounded-lg shadow-lg object-cover"
                                style={{ width: '300px', height: '450px' }}
                            />
                        </div>
                        
                        {/* Movie Details */}
                        <div className="md:w-2/3 text-white">
                            <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                            
                            <div className="mb-6 flex items-center">
                                <div className="bg-black bg-opacity-70 px-3 py-2 rounded-lg flex items-center mr-4">
                                    <span className="text-yellow-400 mr-2"><FaStar /></span>
                                    <span className="font-bold text-2xl">{movie.averageRating.toFixed(1)}</span>
                                    <span className="text-sm ml-2">/ 5</span>
                                </div>
                                <span className="text-gray-300">{movie.ratings} ratings</span>
                            </div>

                            <div className="mb-6 flex flex-wrap gap-4">
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">{movie.certificate}</span>
                                <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">{movie.language}</span>
                                <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">{movie.duration} mins</span>
                                <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">{movie.genre}</span>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-300 mb-2">Release Date</p>
                                <p className="text-xl">{new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>

                            <button onClick={handleBookTickets} className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-300">Book tickets</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* About the movie */}
            <div className="container mx-auto px-4 py-12">
    <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">About the movie</h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">{movie.description}</p>
        
        <div className="border-b border-gray-300 my-12"></div>
        
        {/* Cast */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Cast</h2>
        <div className="flex flex-wrap gap-8 mb-12">
            {movie.cast.map((member, index) => (
                <div key={index} className="text-center group">
                    <div className="relative overflow-hidden rounded-full mb-3">
                        <Image 
                            src={`http://localhost:5000${member.castPhoto}`} 
                            alt={member.castName} 
                            width={120} 
                            height={120} 
                            className="rounded-full object-cover transition duration-300 group-hover:scale-110"
                            style={{ width: '120px', height: '120px' }}
                        />
                    </div>
                    <p className="font-semibold text-gray-800">{member.castName}</p>
                </div>
            ))}
        </div>

        <div className="border-b border-gray-300 my-12"></div>

        {/* Reviews Section */}
        <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Reviews</h2>
            {movie.reviews.length > 0 ? (
                <div className="space-y-6 mb-8">
                    {movie.reviews.map((review: Review, index: number) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center mb-4">
                                <Image 
                                    src={review.user.profilePicture} 
                                    alt={review.user.username} 
                                    width={48} 
                                    height={48} 
                                    className="rounded-full mr-4 object-cover"
                                    style={{ width: '48px', height: '48px' }}
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{review.user.username}</p>
                                    <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                            <p className="text-gray-700">{review.text}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 mb-8 italic">No reviews yet. Be the first to review!</p>
            )}

            {/* Add Review Button */}
            <button 
                onClick={() => setShowReviewForm(true)} 
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 font-semibold"
            >
                Write a Review
            </button>

            {/* Review Form */}
            {showReviewForm && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">Write Your Review</h3>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold text-gray-700">Rating:</label>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className={`cursor-pointer text-2xl ${star <= userRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    onClick={() => setUserRating(star)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold text-gray-700">Your Review:</label>
                        <textarea 
                            value={userReview}
                            onChange={(e) => setUserReview(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                            rows={4}
                            placeholder="Share your thoughts about the movie..."
                        />
                    </div>
                    <button 
                        onClick={handleSubmitReview}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 font-semibold"
                    >
                        Submit Review
                    </button>
                </div>
            )}
        </div>
    </div>
</div>
        </div>
    );
};

export default MovieDetail;