// types.ts

export interface CastMember {
    castName: string;
    castPhoto: File | null;
  }
  
  export interface MovieFormData {
    title: string;
    description: string;
    duration: string;
    genre: string;
    language: string;
    theaters: string[];
    releaseDate: string;
    cast: CastMember[];
    director: string;
    poster: File | null;
    photos: File[];
    certificate: string;
  }
  
  export interface Theater {
    _id: string;
    name: string;
    location: string;
    capacity: number;
  }