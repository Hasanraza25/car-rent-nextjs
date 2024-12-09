"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const ProductSlider = ({ products }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    setScrollPosition((prev) => Math.max(prev - 300, 0));
  };

  const scrollRight = () => {
    setScrollPosition((prev) =>
      Math.min(prev + 300, (products.length - 3) * 300)
    );
  };

  return (
    <div className="relative flex flex-col h-full mb-20">
      {/* Arrow Buttons Centered Above Slider */}
      <div className="absolute -top-10 right-0 flex justify-end w-full">
        <button
          onClick={scrollLeft}
          className="bg-gray-200 w-11 h-11 mx-2 rounded-full shadow hover:bg-gray-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
        </button>
        <button
          onClick={scrollRight}
          className="bg-gray-200 w-11 h-11 rounded-full shadow hover:bg-gray-300"
        >
          <FontAwesomeIcon icon={faArrowRight} className="text-xl" />
        </button>
      </div>

      {/* Slider Container */}
      <div className="w-full mt-12 overflow-hidden relative">
        {/* Cards Container */}
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
