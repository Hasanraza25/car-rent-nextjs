import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import PickUpDropOff from "../components/PickUpDropOff/PickUpDropOff";
import CategoryCars from "../components/Cars/CategoryCars";

const CategoryCar = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative flex flex-1 min-h-screen">
        <Sidebar />
        <div className="flex flex-col w-full">
          <PickUpDropOff />
          <CategoryCars />
        </div>
      </div>
    </div>
  );
};

export default CategoryCar;
