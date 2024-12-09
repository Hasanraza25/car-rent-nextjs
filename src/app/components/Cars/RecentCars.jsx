import React from "react";
import ProductCard from "../Products/ProductCard";

const RecentCars = () => {
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
  ];

  const products2 = [
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
  ];

  return (
    <>
      <div className="container mx-auto flex flex-col mb-20">
        <div className="flex mt-10 items-center font-bold justify-between px-10">
          <h4 className="text-xl text-[#90A3BF] font-semibold">Recent Cars</h4>
          <div>
            <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline pr-20">
              View All
            </button>
          </div>
        </div>
        <div className="flex  mt-6 gap-8  px-4 desktop:flex-wrap desktop:justify-between mobile:overflow-x-auto tablet:overflow-x-auto tablet:gap-4">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>

      <div className="container mx-auto flex flex-col mb-20">
        <div className="flex mt-10 items-center font-bold justify-between px-10">
          <h4 className="text-xl text-[#90A3BF] font-semibold">
            Recommended Cars
          </h4>
          <div>
            <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline pr-20">
              View All
            </button>
          </div>
        </div>
        <div className="flex  mt-6 gap-8 px-4 desktop:flex-wrap desktop:justify-between mobile:overflow-x-auto tablet:overflow-x-auto tablet:gap-4">
          {products2.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default RecentCars;
