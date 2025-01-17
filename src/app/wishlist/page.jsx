"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import ProductCard from "../components/Products/ProductCard";
import { useWishlist } from "../context/WishlistContext";

const WishlistPage = () => {
  const { wishlistItems } = useWishlist();

  const sliderRef = useRef(null);

  // Dragging Logic
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  // Detect screen size to enable/disable drag
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024); // Enable drag for screen widths less than 1024px
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleMouseDown = (e) => {
    if (!isMobileOrTablet) return;
    isDragging.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    if (!isMobileOrTablet) return;
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    if (!isMobileOrTablet) return;
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !isMobileOrTablet) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll faster
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };
  return (
    <>
      <div className="container mx-auto flex flex-col px-8 overflow-hidden my-10">
        <div className="container flex mt-10 items-center font-bold justify-between flex-col md:flex-row">
          <h1 className="text-xl font-medium">
            Wishlist &#40;{wishlistItems.length}&#41;
          </h1>
        </div>
        {wishlistItems && wishlistItems.length > 0 ? (
          <div className="w-full mt-6 relative mx-auto">
            <div
              className="grid mt-6 gap-6 px-5 md:grid md:grid-cols-2 lg:grid-cols-3
      mobile:overflow-x-auto 
      mobile:grid-cols-[auto] 
      mobile:grid-flow-col"
            >
              {wishlistItems.map((product, index) => (
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
        ) : (
          <div className="flex flex-col items-center justify-center h-full pb-10 rounded-lg">
            <img
              src="/images/empty-wishlist.svg" // Use a relevant image for an empty wishlist
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
    </>
  );
};

export default WishlistPage;
