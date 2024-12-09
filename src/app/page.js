import Image from "next/image";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import PickUpDropOff from "./components/PickUpDropOff/PickUpDropOff";
import Cars from "./components/Cars/PopularCars";
import RecommendedCars from "./components/Cars/RecommendedCars";
import Footer from "./components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <PickUpDropOff />
      <Cars />
      <RecommendedCars />
      <Footer />
    </>
  );
}
