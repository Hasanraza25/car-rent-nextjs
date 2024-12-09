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
      <div className="container max-w-[1600px] mx-auto justify-center flex flex-col">
        <div className="flex mt-10 items-center font-bold justify-between px-5">
          <h4 className="text-xl text-[#90A3BF] font-semibold">Popular Car</h4>
          <div>
            <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline">
              View All
            </button>
          </div>
        </div>

        <div className="w-full mt-6 overflow-hidden relative mx-auto">
          <div className="flex desktop:flex-wrap desktop:justify-between mobile:overflow-x-auto mobile:gap-4 tablet:overflow-x-auto tablet:gap-4">
            {products.map((product, index) => (
              <div
                key={index}
                className="min-w-[300px] flex-shrink-0 desktop:w-[calc(25%-1rem)]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        <hr className="mb-10" />
      </div>
    </>
  );
};

export default PopularCars;
