"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import PickUpDropOff from "../components/PickUpDropOff/PickUpDropOff";
import CategoryCars from "../components/Cars/CategoryCars";

const CategoryCar = () => {
  const [filters, setFilters] = useState({
    categories: [],
    capacities: [],
    price: 100,
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-row">
      {/* Sidebar */}
      <div className="flex flex-col">
      <Sidebar onFilterChange={handleFilterChange} />
    <span className="bg-white h-screen"></span>
      </div>
      {/* Main Content */}
      <div className="flex flex-col w-full">
        <PickUpDropOff />
        <CategoryCars filters={filters} />
      </div>
    </div>
  );
};

export default CategoryCar;
