"use client";
import Link from "next/link";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const [isHeartClicked, setIsHeartClicked] = useState(false); // For heart image toggle

  // Heart images (unfilled and filled)
  const heartUnfilled = "/images/heart-unfilled.svg"; // Replace with actual path
  const heartFilled = "/images/heart-filled.svg"; // Replace with actual path

  // Icon images for litres, genre, and people
  const litresIcon = "/images/gas-station.svg"; // Replace with actual path
  const genreIcon = "/images/handle.svg"; // Replace with actual path
  const peopleIcon = "/images/profile-2.svg"; // Replace with actual path

  return (
    <div className="flex-shrink-0 md:w-[23.2rem] w-full h-[30rem] rounded-lg relative mx-4 border-none bg-white shadow-md">
      {/* Title and Subtitle */}
      <div className="p-6">
        <Link
          href={`/cars/${product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with "-"
            .replace(/^-+|-+$/g, "")}`} // Remove leading/trailing hyphens
        >
          <h3 className="text-xl font-semibold cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-[#90A3BF] text-sm font-semibold mt-2">
          {product.category}
        </p>
      </div>

      {/* Action Buttons (Heart) */}
      <div className="absolute top-4 right-2 flex flex-col space-y-2">
        <button
          className="bg-white w-8 h-8 rounded-full flex items-center justify-center hover:text-red-500"
          onClick={() => setIsHeartClicked(!isHeartClicked)}
        >
          <img
            src={isHeartClicked ? heartFilled : heartUnfilled}
            alt="Heart Icon"
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* Product Image with specific width */}
      <div className="w-full h-40 mt-4 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-[300px] h-auto object-contain"
        />
      </div>

      {/* Flex with Litres, Genre, and People */}
      <div className="flex items-center justify-between mt-10 px-6">
        {/* Litres */}
        <div className="flex items-center space-x-2 text-[#90A3BF]">
          <img src={litresIcon} alt="Litres Icon" className="w-7 h-7" />
          <span className="text-sm">{product.litres}L</span>
        </div>

        {/* Genre */}
        <div className="flex items-center space-x-2 text-[#90A3BF]">
          <img src={genreIcon} alt="Genre Icon" className="w-7 h-7" />
          <span className="text-sm">{product.genre}</span>
        </div>

        {/* People */}
        <div className="flex items-center space-x-2 text-[#90A3BF]">
          <img src={peopleIcon} alt="People Icon" className="w-7 h-7" />
          <span className="text-sm">{product.people} People</span>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="mt-4 p-4 m-3">
        <div className="flex items-center justify-between space-x-2">
          <span className="text-[#90A3BF]">
            <span className="text-black text-lg font-bold">
              ${product.price}.00/
            </span>{" "}
            day
          </span>
          <Link
            href={`/rent/${product.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with "-"
              .replace(/^-+|-+$/g, "")}`} // Remove leading/trailing hyphens
          >
            <button className="bg-[#3563E9] hover:bg-[#54A6FF] py-3 px-6 text-white rounded-[5px]">
              Rent Now
            </button>
          </Link>
        </div>
        <span className="text-gray-500 text-lg line-through">
          {product.discount}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
