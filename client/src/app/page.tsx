'use client'
import Footer from "@/modules/user/layout/components/Footer";
import Header from "@/modules/user/layout/components/Header";
import Image from "next/image";
import Banner from '../modules/user/banner/Banner'
import GoogleAuthModal from "@/modules/user/sign-up/components/Signup";
import { signupModalState } from "@/atoms/modalAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import Movies from "@/modules/user/movies/components/Movies";

function Home() { 
   const showModal = useRecoilValue(signupModalState)
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