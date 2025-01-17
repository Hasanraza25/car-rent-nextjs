"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../Products/ProductCard";
import { client } from "@/sanity/lib/client";
import Link from "next/link";

const RecentCars = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const getRecentCars = async () => {
    try {
      const query = `*[_type == 'car' && 'recent' in section ][0..2] | order(_createdAt asc){
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
      setRecentProducts(products);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  useEffect(() => {
    getRecentCars();
  }, []);

  const getRecommendedCars = async () => {
    try {
      const query = `*[_type == 'car' && 'recommended' in section ][0..2] | order(_createdAt asc){
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
      setRecommendedProducts(products);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  useEffect(() => {
    getRecommendedCars();
  }, []);

  return (
    <>
      <div className="container mx-auto flex flex-col mb-20">
        <div className="flex mt-10 items-center font-bold justify-between px-10">
          <h4 className="text-xl text-[#90A3BF] font-semibold">Recent Cars</h4>
          <div>
            <Link href={"/category"} className="">
              <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline md:pr-20">
                View All
              </button>
            </Link>
          </div>
        </div>
        <div
          className="grid mt-6 gap-6 px-5 md:grid md:grid-cols-2 lg:grid-cols-3
      mobile:overflow-x-auto 
      mobile:grid-cols-[auto] 
      mobile:grid-flow-col"
        >
          {recentProducts.map((product, index) => (
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

      <div className="container mx-auto flex flex-col mb-20">
        <div className="flex mt-10 items-center font-bold justify-between px-10">
          <h4 className="text-xl text-[#90A3BF] font-semibold">
            Recommended Cars
          </h4>
          <div>
            <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline md:pr-20">
              View All
            </button>
          </div>
        </div>
        <div
          className="grid mt-6 gap-6 px-5 md:grid md:grid-cols-2 lg:grid-cols-3
      mobile:overflow-x-auto 
      mobile:grid-cols-[auto] 
      mobile:grid-flow-col"
        >
          {recommendedProducts.map((product, index) => (
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
    </>
  );
};

export default RecentCars;
