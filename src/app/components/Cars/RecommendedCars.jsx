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
    <div className="container max-w-[1450px] mx-auto flex flex-col mb-20">
      <div className="flex mt-10 items-center font-bold justify-between px-5">
        <h4 className="text-xl text-[#90A3BF] font-semibold">
          Recommended Car
        </h4>
      </div>
      <div className="w-full mt-6 overflow-hidden relative mx-auto">
        <div className="flex desktop:flex-wrap desktop:justify-between mobile:overflow-x-auto mobile:gap-4 tablet:overflow-x-auto tablet:gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="min-w-[300px] mt-5 flex-shrink-0 desktop:w-[calc(25%-1rem)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center">
        <button className="bg-[#3563E9] hover:bg-[#54A6FF] w-40 mt-20 py-3 mx-auto text-white text-center rounded-[5px]">
          Show more car
        </button>
      </div>
    </div>
  );
};

export default RecommendedCars;
