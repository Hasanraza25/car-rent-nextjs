"use client";
import React, { Suspense, useEffect, useState } from "react";
import ProductCard from "../Products/ProductCard";
import { client } from "@/sanity/lib/client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

const RelatedCars = ({ categories }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendedloading, setRecommendedLoading] = useState(true);

  const getRecommendedCars = async () => {
    try {
      const query = `*[_type == 'car' && 'recommended' in section ] | order(_createdAt asc){
       name,
        "category": type->name,
        price,
        stock,
        image,
        discount,
        steering,
        fuelCapacity,
        seatingCapacity,
        description,
        "currentSlug": slug.current,
         "categorySlug": type->slug.current
        }`;
      const products = await client.fetch(query);
      setRecommendedProducts(products);
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
      setRecommendedLoading(false);
    }
  };

  useEffect(() => {
    getRecommendedCars();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
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

  if (recommendedloading) {
    return (
      <div className="container mx-auto flex flex-col mb-20">
        <div className="flex mt-10 items-center font-bold justify-between px-5 ">
          <h4 className="text-xl text-[#90A3BF] font-semibold">
            Recommended Cars
          </h4>
          <div>
            <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline">
              View All
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center h-screen">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto flex flex-col mb-20">
        {categories.length > 0 ? (
          <>
            <div className="flex mt-10 items-center font-bold justify-between px-5">
              <h4 className="text-xl text-[#90A3BF] font-semibold">
                Related Cars
              </h4>
              <div>
                <Link href={"/cars"} className="">
                  <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline">
                    View All
                  </button>
                </Link>
              </div>
              <div className="grid mt-6 gap-6 w-full mx-auto sm:flex sm:flex-col sm:items-center md:grid md:grid-cols-2 lg:grid-cols-3">
                {categories.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-2xl font-semibold mx-auto text-gray-700 my-2">
            No Related Cars Found!
          </p>
        )}
      </div>

      <div className="container mx-auto flex flex-col mb-20">
        <div className="flex mt-10 items-center font-bold justify-between px-5 ">
          <h4 className="text-xl text-[#90A3BF] font-semibold">
            Recommended Cars
          </h4>
          <div>
            <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline">
              View All
            </button>
          </div>
        </div>
        <div className="mt-6 px-2">
          <Suspense fallback={<div className="loader"></div>}>
            <Slider {...sliderSettings}>
              {recommendedProducts.map((product, index) => (
                <div key={index} className="w-full px-2">
                  <ProductCard key={index} product={product} />
                </div>
              ))}
            </Slider>
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default RelatedCars;
