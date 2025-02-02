"use client";
import { useWishlist } from "@/app/Context/WishlistContext";
import { urlFor } from "@/sanity/lib/client";
import Link from "next/link";

const ProductCard = ({ product }) => {
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const heartUnfilled = "/images/heart-unfilled.svg";
  const heartFilled = "/images/heart-filled.svg";

  const isHeartClicked = wishlistItems.some(
    (item) => item.currentSlug === product.currentSlug
  );

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isHeartClicked) {
      removeFromWishlist(product.currentSlug);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="w-full h-full min-h-[28.2rem] mobile:min-h-[32rem] rounded-lg relative border-none bg-white shadow-md">
      {/* Title and Subtitle */}
      <div className="p-6">
        <Link href={`/cars/${product.categorySlug}/${product.currentSlug}`}>
          <h3 className="text-xl font-semibold cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <Link href={`/cars/${product.categorySlug}`}>
          <p className="text-[#90A3BF] text-sm font-semibold mt-2 hover:text-[#3563E9]">
            {product.category}
          </p>
        </Link>
      </div>

      {/* Action Buttons (Heart) */}
      <div className="absolute top-4 right-2 flex flex-col space-y-2">
        <button
          className="bg-white w-8 h-8 rounded-full flex items-center justify-center hover:text-red-500"
          onClick={handleWishlistToggle}
        >
          <img
            src={isHeartClicked ? heartFilled : heartUnfilled}
            alt="Heart Icon"
            className="w-6 h-6"
          />
        </button>
      </div>
      <Link href={`/cars/${product.categorySlug}/${product.currentSlug}`}>
        {/* Product Image */}
        <div className="w-full h-40 mt-4 flex items-center justify-center">
          <img
            src={urlFor(product.image)}
            alt={product.name}
            className="w-[250px] h-auto object-contain"
          />
        </div>
      </Link>

      {/* Flex with Litres, Genre, and People */}
      <div className="flex mobile:flex-wrap items-center justify-between mt-10 px-6 gap-3">
        {/* Litres */}
        <div className="flex items-center space-x-2 text-[#90A3BF]">
          <img
            src="/images/gas-station.svg"
            alt="Litres Icon"
            className="w-7 h-7"
          />
          <span className="text-xs">{product.fuelCapacity}L</span>
        </div>

        {/* Genre */}
        <div className="flex items-center space-x-2 text-[#90A3BF]">
          <img src="/images/handle.svg" alt="Genre Icon" className="w-7 h-7" />
          <span className="text-xs">{product.steering}</span>
        </div>

        {/* People */}
        <div className="flex items-center space-x-2 text-[#90A3BF]">
          <img
            src="/images/profile-2.svg"
            alt="People Icon"
            className="w-7 h-7"
          />
          <span className="text-xs">{product.seatingCapacity} People</span>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="mt-4 p-4 m-3">
        <div className="flex items-center justify-between space-x-2">
          <span className="flex flex-col text-[#90A3BF]">
            <span>
              <span className="text-black text-lg font-bold">
                ${product.price}.00/
              </span>{" "}
              day
            </span>
            <span className="text-gray-500 text-lg line-through">
              {product.discount}
            </span>
          </span>
          <Link href={`/rent/${product.currentSlug}`}>
            <button className="bg-[#3563E9] hover:bg-[#54A6FF] py-3 px-5 mobile:px-3 text-white rounded-[5px]">
              Rent Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
