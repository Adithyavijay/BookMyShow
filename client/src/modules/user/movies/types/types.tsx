type CastMember = {
    castName: string;
    castPhoto?: string;
  };
  
  
  export interface Review {
    user: {
      username: string;
      profilePicture: string;
    };
    text: string;
    date: string;
  }
 
  export interface ApiResponse<T> {
    data: T;
    message: string;
    status: boolean;
  }
  
  export interface Movie {
    _id: string; // MongoDB ObjectId
    title: string;
    description: string;
    duration: number;
    genre: string;
    language: string;
    releaseDate: string;
    certificate: string;
    photos: string[];
    poster: string;
    director: string;
    cast: CastMember[];
    theaters: string[]; // Array of Theater ObjectIds
    ratings: number;
    averageRating: number;
    reviews: Review[];
  };
  