"use client";
import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import PickUpDropOff from "../components/PickUpDropOff/PickUpDropOff";
import CategoryCars from "../components/Cars/CategoryCars";

const CategoryCar = () => {
  const [filters, setFilters] = useState({
    categories: [],
    capacities: [],
    price: 100,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const carsSectionRef = useRef(null); // ✅ Create ref for CategoryCars

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-row">
      {/* Sidebar */}
      <div className="flex flex-col">
        <Sidebar
          onFilterChange={handleFilterChange}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          carsSectionRef={carsSectionRef} // ✅ Pass ref to Sidebar
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full">
        <PickUpDropOff />
        {/* ✅ Attach ref to CategoryCars */}
        <CategoryCars filters={filters} carsSectionRef={carsSectionRef} />
      </div>
    </div>
  );
};

export default CategoryCar;