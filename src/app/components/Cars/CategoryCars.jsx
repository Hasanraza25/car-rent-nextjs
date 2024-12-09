import React from "react";
import ProductCard from "../Products/ProductCard";

const CategoryCars = () => {
  const products = [
    {
      image: "/images/cars/car-1.svg",
      name: "Koenigsegg",
      price: 99,
      discount: " ",
      category: "Sport",
      genre: "Manual",
      litres: 90,
      people: 2,
    },
    {
      image: "/images/cars/car-2.svg",
      name: "Nissan GT - R",
      price: 80,
      discount: "$100",
      category: "Sport",
      genre: "Manual",
      litres: 80,
      people: 2,
    },
    {
      image: "/images/cars/car-3.svg",
      name: "Rolls - Royce",
      price: 96,
      discount: " ",
      category: "Sedan",
      genre: "Manual",
      litres: 70,
      people: 4,
    },
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
  ];

  return (
    <div className="container mx-auto flex flex-col mb-20">

      <div className="grid mt-6 gap-8  px-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:justify-items-center">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <div className="flex items-center">
        <button className="bg-[#3563E9] hover:bg-[#54A6FF] w-40 mt-20 py-3 mx-auto text-white text-center rounded-[5px]">
          Show more cars
        </button>
      </div>
    </div>
  );
};

export default CategoryCars;
