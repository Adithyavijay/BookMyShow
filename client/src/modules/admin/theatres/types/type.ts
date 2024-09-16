export interface  Theater {
    _id: string;
    name: string;
    location: string;
    capacity: number;
}

export interface AddTheaterData {
    name: string;
    location: string;
    capacity: number;
} 

export interface EditTheaterData {
    name: string;
    location: string;
    capacity: number;
} 