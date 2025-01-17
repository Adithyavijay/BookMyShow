'use client'
import Footer from "@/modules/user/layout/components/Footer";
import Header from "@/modules/user/layout/components/Header";
import Banner from '../modules/user/banner/Banner'
import Movies from "@/modules/user/movies/components/Movies";
import ComingSoon from "@/modules/user/coming-soon/ComingSoon";
import FeaturedEvents from "@/modules/user/Features/FeaturedEvents";
import MovieBento from "@/modules/user/movie-collections/MovieBento";

function Home() { 
   
  return (
   <>
    <Header/>
    <Banner/>  
    <MovieBento/>
    <FeaturedEvents/>
    <Movies/>
    <ComingSoon/>
    <Footer/>
   </>
   
  );
}
export default Home;