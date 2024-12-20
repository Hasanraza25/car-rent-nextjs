"use client";
import React, { useState } from "react";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";

const Sidebar = () => {
  const typeCounts = {
    Sport: 10,
    SUV: 12,
    MPV: 16,
    Sedan: 20,
    Coupe: 14,
    Hatchback: 14,
  };
  const capacityCounts = {
    "2 Person": 10,
    "4 Person": 14,
    "6 Person": 12,
    "8 or More": 16,
  };

  const [price, setPrice] = useState(100);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Sidebar Toggle Button (Mobile and Tablet Only) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-5 left-5 z-50 p-2 bg-white shadow-md rounded-full focus:outline-none tablet:block mobile:block hidden"
      >
        {isOpen ? <FiArrowLeft size={24} /> : <FiArrowRight size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-white min-h-screen shadow-md p-6 pl-20 transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } desktop:translate-x-0 tablet:fixed mobile:fixed desktop:static top-0 left-0 z-40 desktop:w-[400px] w-[300px]`}
      >
        {/* Type Section */}
        <div className="mb-8">
          <h3 className="text-xs font-medium text-gray-400 tracking-widest mb-4">
            TYPE
          </h3>
          <div className="space-y-4">
            {Object.entries(typeCounts).map(([type, count]) => (
              <label
                key={type}
                className="flex items-center text-sm font-medium text-gray-500"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-300 tracking-widest"
                />
                <span className="ml-3 text-lg">
                  {type} <span className="text-gray-400">&nbsp;({count})</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Capacity Section */}
        <div className="mb-8">
          <h3 className="text-xs font-medium text-gray-400 tracking-widest mb-4">
            CAPACITY
          </h3>
          <div className="space-y-4">
            {Object.entries(capacityCounts).map(([capacity, count]) => (
              <label
                key={capacity}
                className="flex items-center text-sm text-gray-500"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-200"
                />
                <span className="ml-3 text-lg">
                  {capacity} <span className="text-gray-400">&nbsp;({count})</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Section */}
        <div>
          <h3 className="text-xs font-medium text-gray-400 tracking-widest mb-4">
            PRICE
          </h3>
          <div className="flex flex-col space-y-4">
            <input
              type="range"
              min="0"
              max="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${price}%, #d1d5db ${price}%, #d1d5db 100%)`,
              }}
            />
            <span className="text-lg text-gray-600">Max. ${price}.00</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
