"use client";
import React, { Suspense, useEffect, useState } from "react";
import ProductCard from "../Products/ProductCard";
import { client } from "@/sanity/lib/client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

const RecentCars = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recentloading, setRecentLoading] = useState(true);
  const [recommendedloading, setRecommendedLoading] = useState(true);

  const getRecentCars = async () => {
    try {
      const query = `*[_type == 'car' && 'recent' in section ] | order(_createdAt asc){
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
        }`;
      const products = await client.fetch(query);
      setRecentProducts(products);
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
      setRecentLoading(false);
    }
  };

  useEffect(() => {
    getRecentCars();
  }, []);

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

  if (recentloading) {
    return (
      <div className="container mx-auto flex flex-col mb-20">
        <div className="flex mt-10 items-center font-bold justify-between px-10">
          <h4 className="text-xl text-[#90A3BF] font-semibold">Recent Cars</h4>
          <div>
            <Link href={"/cars"} className="">
              <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline md:pr-20">
                View All
              </button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

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
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto flex flex-col mb-20">
        <div className="flex mt-10 items-center font-bold justify-between px-5">
          <h4 className="text-xl text-[#90A3BF] font-semibold">Recent Cars</h4>
          <div>
            <Link href={"/cars"} className="">
              <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline">
                View All
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-6 px-2">
          <Slider {...sliderSettings}>
            {recentProducts.map((product, index) => (
              <div key={index} className="w-full px-2">
                <ProductCard key={index} product={product} />
              </div>
            ))}
          </Slider>
        </div>
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

export default RecentCars;
