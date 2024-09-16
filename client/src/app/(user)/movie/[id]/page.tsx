import MovieDetail from './MovieDetail';
import { Movie } from '../../../../modules/user/movies/types/types'; // Adjust the import path as needed

export default async function MoviePage({ params }: { params: { id: string } }) {  
  return <MovieDetail id={params.id} />;
}