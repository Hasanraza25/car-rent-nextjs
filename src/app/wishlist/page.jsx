"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../components/Products/ProductCard";
import { useWishlist } from "../Context/WishlistContext";

const WishlistPage = () => {
  const { wishlistItems } = useWishlist();
  const [loading, setLoading] = useState(true);

  // Simulate localStorage loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading once wishlistItems are fetched
    }, 1000); // Adjust delay if needed

    return () => clearTimeout(timer); // Cleanup timeout
  }, [wishlistItems]);

  return (
    <div className="container mx-auto flex flex-col px-5 overflow-hidden my-10">
      <div className="container flex mt-10 items-center font-bold justify-between flex-col md:flex-row">
        <h1 className="text-xl font-medium">
          Wishlist &#40;{wishlistItems.length}&#41;
        </h1>
      </div>

      {/* Show Loader While Fetching Data */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="loader"></div> {/* Replace with actual loader */}
        </div>
      ) : wishlistItems.length > 0 ? (
        <div className="grid mt-6 gap-6 w-full mx-auto sm:flex sm:flex-col sm:items-center md:grid md:grid-cols-2 lg:grid-cols-4">
          {wishlistItems.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen pb-10 rounded-lg">
          <img
            src="/images/empty-wishlist.svg"
            alt="Empty Wishlist"
            className="w-60 h-60 mb-6"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Oops! Your wishlist is empty 🚗💔
          </h2>
          <p className="text-gray-600 text-center text-sm md:text-base max-w-md mb-6">
            Looks like you haven’t saved any cars yet. Start exploring now to
            add your dream rides to the wishlist!
          </p>
          <Link
            href="/cars"
            className="px-6 py-3 bg-[#db4444] hover:bg-[#fa4545] text-white font-semibold rounded-full shadow-md transition-all duration-300"
          >
            🚗 Browse Cars & Add to Wishlist
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
