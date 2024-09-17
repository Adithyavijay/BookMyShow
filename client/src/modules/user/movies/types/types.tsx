type CastMember = {
    castName: string;
    castPhoto?: string;
  };
  
  type Rating = {
    user: string; // Assuming ObjectId is represented as a string
    value: number;
  };
  
  export interface Review {
    user: {
      username: string;
      profilePicture: string;
    };
    text: string;
    date: string;
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
    ratings: Rating[];
    averageRating: number;
    reviews: Review[];
  };
  