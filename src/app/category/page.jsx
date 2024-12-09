import React from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import PickUpDropOff from "../components/PickUpDropOff/PickUpDropOff";
import CategoryCars from "../components/Cars/CategoryCars";
import Footer from "../components/Footer/Footer";

const CategoryCar = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col w-full md:pr-20">
          <PickUpDropOff />
          <CategoryCars />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryCar;
