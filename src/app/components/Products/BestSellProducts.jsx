import React from "react";
import ProductCard from "./ProductCard";

const BestSellProducts = () => {
  const products = [
    {
      image: "/images/product-game.svg",
      name: "Gamepad",
      discountedPrice: 120,
      originalPrice: 160,
      discount: 35,
      rating: 4.5,
      buyers: 88,
    },
    {
      image: "/images/product-keyboard.svg",
      name: "Keyboard",
      discountedPrice: 960,
      originalPrice: 1000,
      discount: 35,
      rating: 4,
      buyers: 122,
    },
    {
      image: "/images/lcd.svg",
      name: "Monitor",
      discountedPrice: 370,
      originalPrice: 400,
      discount: 30,
      rating: 5,
      buyers: 20,
    },
    {
      image: "/images/chair.svg",
      name: "Chair",
      discountedPrice: 375,
      originalPrice: 450,
      discount: 25,
      rating: 4.5,
      buyers: 75,
    },
  ];
  return (
    <>
      <div className="container mx-auto flex flex-col">
        <div className="heading container mx-auto flex items-center">
          <span className="bg-[#db4444] w-[30px] h-[55px] border rounded-[5px]"></span>
          <h4 className="text-[#db4444] font-bold mx-5 text-lg">This Month</h4>
        </div>
        <div className="flex mt-10 items-center font-bold justify-between">
          <h1 className="text-4xl font-semibold">Best Selling Products</h1>
          <div className="mb-10">
            <button className="bg-[#db4444] hover:bg-[#fa4545] py-4 px-12 text-white rounded-[5px]">
              View All
            </button>
          </div>
        </div>
        <div className="w-full mt-12 overflow-hidden relative">
          <div className="flex">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
        <hr className="mb-10" />
      </div>
    </>
  );
};

export default BestSellProducts;
