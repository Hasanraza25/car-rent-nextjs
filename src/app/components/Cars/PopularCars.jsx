"use client";
import React, { Suspense, useEffect, useState } from "react";
import ProductCard from "../Products/ProductCard";
import { client } from "@/sanity/lib/client";
import { ClipLoader } from "react-spinners";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PopularCars = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCars = async () => {
    try {
      const query = `*[_type == 'car' && 'popular' in section ] | order(_createdAt asc){
          name,
        type,
        price,
        stock,
        image,
        discount,
        steering,
        fuelCapacity,
        seatingCapacity,
        description,
        "currentSlug": slug.current,
      }`;
      const products = await client.fetch(query);
      setProducts(products);
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1300, // Tablet
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024, // Tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 700, // Mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    swipeToSlide: true, // Enable grabbing on desktop and swipe on mobile
  };

  if (loading) {
    return (
      <div className="container max-w-[1700px] mx-auto flex flex-col overflow-hidden">
        <div className="flex mt-10 items-center font-bold justify-between px-10">
          <h4 className="text-xl text-[#90A3BF] font-semibold">
            Popular Cars
          </h4>
          <div>
            <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline">
              View All
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#db4444" size={80} />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-[1700px] mx-auto flex flex-col mb-20">
      <div className="flex mt-10 items-center font-bold justify-between px-5">
        <h4 className="text-xl text-[#90A3BF] font-semibold">Popular Cars</h4>
        <div>
          <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline">
            View All
          </button>
        </div>
      </div>

      <div className="w-full mt-6 relative mx-auto px-3">
        <Suspense fallback={<ClipLoader size={50} color="#3563E9" />}>
          <Slider {...sliderSettings}>
            {products.map((product, index) => (
              <div key={index} className="px-3">
                <ProductCard product={product} />
              </div>
            ))}
          </Slider>
        </Suspense>
      </div>
    </div>
  );
};

export default PopularCars;
