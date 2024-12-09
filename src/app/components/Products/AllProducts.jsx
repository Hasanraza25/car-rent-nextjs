import React from "react";
import AllProductSlider from "./AllProductSlider";

const AllProducts = () => {
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
    {
      image: "/images/chair.svg",
      name: "Gamepad",
      discountedPrice: 120,
      originalPrice: 150,
      discount: 40,
      rating: 4.5,
      buyers: 88,
    },
    {
      image: "/images/product-keyboard.svg",
      name: "Keyboard",
      discountedPrice: 960,
      originalPrice: 1050,
      discount: 35,
      rating: 4,
      buyers: 52,
    },
    {
      image: "/images/product-game.svg",
      name: "Monitor",
      discountedPrice: 370,
      originalPrice: 400,
      discount: 30,
      rating: 5,
      buyers: 30,
    },
    {
      image: "/images/chair.svg",
      name: "Chair",
      discountedPrice: 375,
      originalPrice: 500,
      discount: 25,
      rating: 4.5,
      buyers: 114,
    },
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
    {
      image: "/images/chair.svg",
      name: "Gamepad",
      discountedPrice: 120,
      originalPrice: 150,
      discount: 40,
      rating: 4.5,
      buyers: 88,
    },
    {
      image: "/images/product-keyboard.svg",
      name: "Keyboard",
      discountedPrice: 960,
      originalPrice: 1050,
      discount: 35,
      rating: 4,
      buyers: 52,
    },
    {
      image: "/images/product-game.svg",
      name: "Monitor",
      discountedPrice: 370,
      originalPrice: 400,
      discount: 30,
      rating: 5,
      buyers: 30,
    },
    {
      image: "/images/chair.svg",
      name: "Chair",
      discountedPrice: 375,
      originalPrice: 500,
      discount: 25,
      rating: 4.5,
      buyers: 114,
    },
    
  ];
  return (
    <>
      <div className="container mx-auto flex flex-col">
        <div className="heading container mx-auto flex items-center mt-32">
          <span className="bg-[#db4444] w-[30px] h-[55px] border rounded-[5px]"></span>
          <h4 className="text-[#db4444] font-bold mx-5 text-lg">
            Our Products
          </h4>
        </div>
        <div className="flex mt-10 items-center font-bold justify-start">
          <h1 className="text-4xl font-semibold">Flash Sales</h1>
        </div>
        <AllProductSlider products={products} />
        <div className="text-center mb-10">
          <button className="bg-[#db4444] hover:bg-[#fa4545] py-4 px-10 text-white rounded-[5px]">
            Explore Our Products
          </button>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
