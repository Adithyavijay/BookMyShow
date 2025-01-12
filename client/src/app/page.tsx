'use client'
import Footer from "@/modules/user/layout/components/Footer";
import Header from "@/modules/user/layout/components/Header";
import Banner from '../modules/user/banner/Banner'
import Movies from "@/modules/user/movies/components/Movies";

function Home() { 
   
  return (
   <>
    <Header/>
    <Banner/>  
    <Movies/>
    <Footer/>
   </>
   
  );
}
export default Home;