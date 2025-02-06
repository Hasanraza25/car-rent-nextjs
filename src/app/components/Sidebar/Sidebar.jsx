"use client";
import React, { useEffect, useState, Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { ClipLoader } from "react-spinners";

const Sidebar = ({ onFilterChange, setIsOpen, isOpen }) => {
  const [categories, setCategories] = useState([]);
  const [seatingCapacities, setSeatingCapacities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCapacities, setSelectedCapacities] = useState([]);
  const [price, setPrice] = useState(100);

  useEffect(() => {
    getCategories();
    getSeatingCapacities();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  async function getCategories() {
    try {
      const query = `*[_type == 'categories']{
        name,
        totalStock
      }`;
      const data = await client.fetch(query);
      setCategories(data);
    } catch (err) {
      console.log("Categories failed to fetch:", err);
    }
  }

  async function getSeatingCapacities() {
    try {
      const query = `*[_type == 'car']{
        seatingCapacity
      } | order(seatingCapacity asc)`;
      const data = await client.fetch(query);

      const groupedData = data.reduce((acc, car) => {
        const { seatingCapacity } = car;
        if (!acc[seatingCapacity]) {
          acc[seatingCapacity] = { seatingCapacity, count: 0 };
        }
        acc[seatingCapacity].count += 1;
        return acc;
      }, {});

      const groupedArray = Object.values(groupedData);
      setSeatingCapacities(groupedArray);
    } catch (err) {
      console.log("Categories failed to fetch:", err);
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  const handleCapacityChange = (capacity) => {
    setSelectedCapacities((prevSelected) =>
      prevSelected.includes(capacity)
        ? prevSelected.filter((c) => c !== capacity)
        : [...prevSelected, capacity]
    );
  };

  const handleFilterCars = () => {
    const formattedCapacities = selectedCapacities.map((capacity) => Number(capacity));
  
    onFilterChange({
      categories: selectedCategories,
      capacities: formattedCapacities,
      price,
    });
  
    // ✅ Close the sidebar after filtering (Only for Mobile & Tablet)
    if (window.innerWidth <= 1024) {
      setIsOpen(false);
    }
  };
  

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
        className={`bg-white h-full p-6 pl-20 transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } desktop:translate-x-0 tablet:fixed mobile:fixed desktop:static top-0 left-0 z-40 desktop:w-[320px] w-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500`}
      >
        {/* Type Section */}
        <div className="mb-8">
          <h3 className="text-xs font-medium text-gray-400 tracking-widest mb-4">
            TYPE
          </h3>

          <Suspense fallback={<ClipLoader color="#3563E9" size={50} className="mx-auto mt-6" />}>
            <div className="space-y-4">
              {categories.length === 0 ? (
                <ClipLoader color="#3563E9" size={50} className="mx-auto mt-6" />
              ) : (
                categories.map((category) => (
                  <label
                    key={category.name}
                    className="flex items-center text-sm font-medium text-gray-500"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-300 tracking-widest"
                      onChange={() => handleCategoryChange(category.name)}
                    />
                    <span className="ml-3 text-lg">
                      {category.name}{" "}
                      <span className="text-gray-400">
                        &nbsp;({category.totalStock || 0})
                      </span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </Suspense>
        </div>

        {/* Capacity Section */}
        <div className="mb-8">
          <h3 className="text-xs font-medium text-gray-400 tracking-widest mb-4">
            CAPACITY
          </h3>

          <Suspense fallback={<ClipLoader color="#3563E9" size={50} className="mx-auto mt-6" />}>
            <div className="space-y-4">
              {seatingCapacities.length === 0 ? (
                <ClipLoader color="#3563E9" size={50} className="mx-auto mt-6" />
              ) : (
                seatingCapacities.map((capacity) => (
                  <label
                    key={capacity.seatingCapacity}
                    className="flex items-center text-sm text-gray-500"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-200"
                      onChange={() =>
                        handleCapacityChange(capacity.seatingCapacity)
                      }
                    />
                    <span className="ml-3 text-lg">
                      {capacity.seatingCapacity} Person{" "}
                      <span className="text-gray-400">({capacity.count})</span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </Suspense>
        </div>

        {/* Price Section */}
        <div className="mb-8">
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

        {/* Filter Button */}
        <div className="mt-8">
          <button
            onClick={handleFilterCars}
            className="animated-button text-white text-lg w-40 px-4 py-3 rounded-md shadow-md transition duration-300"
          >
            Filter Cars
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
