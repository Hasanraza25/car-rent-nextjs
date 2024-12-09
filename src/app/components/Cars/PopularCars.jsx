import React from "react";
import ProductCard from "../Products/ProductCard";

const PopularCars = () => {
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
      image: "/images/cars/car-4.svg",
      name: "Nissan GT - R",
      price: 80,
      discount: "$100",
      category: "Sport",
      genre: "Manual",
      litres: 80,
      people: 2,
    },
  ];

  return (
    <>
      <div className="container max-w-[1450px] mx-auto flex flex-col mb-20">
        <div className="flex mt-10 items-center font-bold justify-between px-5">
          <h4 className="text-xl text-[#90A3BF] font-semibold">
            Popular Cars
          </h4>
        </div>
        {/* Responsive grid layout */}
        <div
          className="grid mt-6 gap-6 px-5 sm:flex sm:flex-col sm:items-center md:grid md:grid-cols-2 lg:grid-cols-4 mobile:overflow-x-auto 
      mobile:grid-cols-[auto] 
      mobile:grid-flow-col"
        >
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        <div className="flex items-center">
          <button className="bg-[#3563E9] hover:bg-[#54A6FF] w-40 mt-20 py-3 mx-auto text-white text-center rounded-[5px]">
            Show more car
          </button>
        </div>
      </div>
    </>
  );
};

export default PopularCars;
