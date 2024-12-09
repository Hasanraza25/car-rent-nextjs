import React from "react";
import ProductCard from "../Products/ProductCard";

const RecommendedCars = () => {
  const products = [
    {
      image: "/images/cars/car-5.svg",
      name: "All New Rush",
      price: 72,
      discount: "$80.00",
      category: "SUV",
      genre: "Manual",
      litres: 70,
      people: 6,
    },
    {
      image: "/images/cars/car-6.svg",
      name: "CR  - V",
      price: 80,
      discount: " ",
      category: "SUV",
      genre: "Manual",
      litres: 80,
      people: 6,
    },
    {
      image: "/images/cars/car-7.svg",
      name: "All New Terios",
      price: 74,
      discount: " ",
      category: "SUV",
      genre: "Manual",
      litres: 90,
      people: 6,
    },
    {
      image: "/images/cars/car-6.svg",
      name: "CR  - V",
      price: 80,
      discount: " ",
      category: "SUV",
      genre: "Manual",
      litres: 80,
      people: 6,
    },
    {
      image: "/images/cars/car-9.svg",
      name: "MG ZX Exclusice",
      price: 76,
      discount: "$80.00",
      category: "Hatchback",
      genre: "Manual",
      litres: 70,
      people: 4,
    },
    {
      image: "/images/cars/car-10.svg",
      name: "New MG ZS",
      price: 80,
      category: "SUV",
      genre: "Manual",
      litres: 80,
      people: 6,
    },
    {
      image: "/images/cars/car-11.svg",
      name: "MG ZX Excite",
      price: 74,
      discount: " ",
      category: "Hatchback",
      genre: "Manual",
      litres: 90,
      people: 4,
    },
    {
      image: "/images/cars/car-10.svg",
      name: "New MG ZS",
      price: 80,
      category: "SUV",
      genre: "Manual",
      litres: 80,
      people: 6,
    },
  ];

  return (
    <div className="container max-w-[1600px] mx-auto flex flex-col mb-20">
      <div className="flex mt-10 items-center font-bold justify-between px-5">
        <h4 className="text-xl text-[#90A3BF] font-semibold">
          Recommended Car
        </h4>
      </div>
      {/* Responsive grid layout */}
      <div className="grid mt-6 gap-6 px-5 sm:flex sm:flex-col sm:items-center md:grid md:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <div className="flex items-center">
        <button className="bg-[#3563E9] hover:bg-[#54A6FF] w-40 mt-20 py-3 mx-auto text-white text-center rounded-[5px]">
          Show more car
        </button>
        <p className="text-end text-[#90A3BF] mt-20 sm:hidden">120 Car</p>
      </div>
    </div>
  );
};

export default RecommendedCars;
