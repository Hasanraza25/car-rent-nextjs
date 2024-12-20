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
            <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline md:pr-20">
              View All
            </button>
          </div>
        </div>
        <div
          className="grid mt-6 gap-6 px-5 md:grid md:grid-cols-2 lg:grid-cols-3
      mobile:overflow-x-auto 
      mobile:grid-cols-[auto] 
      mobile:grid-flow-col"
        >
          {products.map((product, index) => (
            <div
              key={index}
              className="
     flex-shrink-0 sm:w-[20rem]
   "
            >
              <ProductCard key={index} product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto flex flex-col mb-20">
        <div className="flex mt-10 items-center font-bold justify-between px-10">
          <h4 className="text-xl text-[#90A3BF] font-semibold">
            Recommended Cars
          </h4>
          <div>
            <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline md:pr-20">
              View All
            </button>
          </div>
        </div>
        <div
          className="grid mt-6 gap-6 px-5 md:grid md:grid-cols-2 lg:grid-cols-3
      mobile:overflow-x-auto 
      mobile:grid-cols-[auto] 
      mobile:grid-flow-col"
        >
          {products2.map((product, index) => (
            <div
              key={index}
              className="
      flex-shrink-0 sm:w-[20rem]
    "
            >
              <ProductCard key={index} product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RecentCars;
