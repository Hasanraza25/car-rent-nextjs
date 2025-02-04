"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../Products/ProductCard";
import Link from "next/link";
import { client } from "@/sanity/lib/client";

const RecommendedCars = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCars = async () => {
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
        "categorySlug": type->slug.current,
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

  if (loading) {
    return (
      <>
        <div className="container max-w-[1700px] mx-auto flex flex-col">
          <div className="flex mt-10 items-center font-bold justify-between px-5">
            <div className="flex mt-10 items-center font-bold justify-between px-5">
              <h4 className="text-xl text-[#90A3BF] font-semibold">
                Recommended Cars
              </h4>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      </>
    );
  }

  return (
    <div className="container max-w-[1700px] mx-auto flex flex-col mb-20">
      <div className="flex mt-10 items-center font-bold justify-between px-5">
        <h4 className="text-xl text-[#90A3BF] font-semibold">
          Recommended Cars
        </h4>
      </div>
      {/* Responsive grid layout */}
      <div className="grid mt-6 gap-6 px-5 sm:flex sm:flex-col sm:items-center md:grid md:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <div className="flex items-center">
        <Link href="/cars" className="mx-auto">
          <button className="animated-button text-lg w-60 mt-10 py-4 mx-auto text-white text-center rounded-[5px]">
            Show more cars
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RecommendedCars;
