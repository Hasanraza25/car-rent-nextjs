"use client";
import { useWishlist } from "@/app/context/WishlistContext";
import { urlFor } from "@/sanity/lib/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const [isHeartClicked, setIsHeartClicked] = useState(false); // For heart image toggle
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  // Heart images (unfilled and filled)
  const heartUnfilled = "/images/heart-unfilled.svg"; // Replace with actual path
  const heartFilled = "/images/heart-filled.svg"; // Replace with actual path

  // Icon images for litres, genre, and people
  const litresIcon = "/images/gas-station.svg"; // Replace with actual path
  const genreIcon = "/images/handle.svg"; // Replace with actual path
  const peopleIcon = "/images/profile-2.svg"; // Replace with actual path

  useEffect(()=>{
    if(wishlistItems.some((item)=>item.currentSlug === product.currentSlug)){
      setIsHeartClicked(true)
    };
  }, [wishlistItems, product.currentSlug]);

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    setIsHeartClicked(!isHeartClicked);
    if (isHeartClicked) {
      removeFromWishlist(product.currentSlug);
    } else {
      addToWishlist(product);
      toast.success("Car added to Wishlist!", {
        autoClose: 2000,
        closeButton: false,
      });
    }
  };

  return (
    <div className="flex-shrink-0 w-full h-[30rem] rounded-lg relative border-none bg-white shadow-md">
      <Link
        href={`/cars/${product.currentSlug}`} // Remove leading/trailing hyphens
      >
        {/* Title and Subtitle */}
        <div className="p-6">
          <h3 className="text-xl font-semibold cursor-pointer">
            {product.name}
          </h3>
          <p className="text-[#90A3BF] text-sm font-semibold mt-2">
            {product.type}
          </p>
        </div>
      </Link>

      {/* Action Buttons (Heart) */}
      <div className="absolute top-4 right-2 flex flex-col space-y-2">
        <button
          className="bg-white w-8 h-8 rounded-full flex items-center justify-center hover:text-red-500"
          onClick={handleAddToWishlist}
        >
          <img
            src={isHeartClicked ? heartFilled : heartUnfilled}
            alt="Heart Icon"
            className="w-6 h-6"
          />
        </button>
      </div>
      <Link
        href={`/cars/${product.currentSlug}`} // Remove leading/trailing hyphens
      >
        {/* Product Image with specific width */}
        <div className="w-full h-40 mt-4 flex items-center justify-center">
          <img
            src={urlFor(product.image)}
            alt={product.name}
            className="w-[250px] h-auto object-contain"
          />
        </div>
      </Link>
      {/* Flex with Litres, Genre, and People */}
      <div className="flex items-center justify-between mt-10 px-6">
        {/* Litres */}
        <div className="flex items-center space-x-2 text-[#90A3BF]">
          <img src={litresIcon} alt="Litres Icon" className="w-7 h-7" />
          <span className="text-sm">{product.fuelCapacity}L</span>
        </div>

        {/* Genre */}
        <div className="flex items-center space-x-2 text-[#90A3BF]">
          <img src={genreIcon} alt="Genre Icon" className="w-7 h-7" />
          <span className="text-sm">{product.steering}</span>
        </div>

        {/* People */}
        <div className="flex items-center space-x-2 text-[#90A3BF]">
          <img src={peopleIcon} alt="People Icon" className="w-7 h-7" />
          <span className="text-sm">{product.seatingCapacity} People</span>
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
            href={`/rent/${product.currentSlug}`}
          >
            <button className="bg-[#3563E9] hover:bg-[#54A6FF] py-3 px-5 text-white rounded-[5px]">
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
