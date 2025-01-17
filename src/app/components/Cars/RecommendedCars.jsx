"use client"
import React, { useEffect, useState } from "react";
import ProductCard from "../Products/ProductCard";
import Link from "next/link";
import { client } from "@/sanity/lib/client";

const RecommendedCars = () => {
  const [products, setProducts] = useState([]);

  const getCars = async () => {
    try {
      const query = `*[_type == 'car' && 'recommended' in section ] | order(_createdAt asc)`;
      const products = await client.fetch(query);
      setProducts(products);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  return (
    <div className="container max-w-[1700px] mx-auto flex flex-col mb-20">
      <div className="flex mt-10 items-center font-bold justify-between px-5">
        <h4 className="text-xl text-[#90A3BF] font-semibold">
          Recommended Car
        </h4>
      </div>
      {/* Responsive grid layout */}
      <div className="grid mt-6 gap-6 px-5 sm:flex sm:flex-col sm:items-center md:grid md:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <div className="flex items-center">
        <Link href="/category" className="mx-auto">
          <button className="bg-[#3563E9] hover:bg-[#54A6FF] w-40 mt-20 py-3 mx-auto text-white text-center rounded-[5px]">
            Show more car
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RecommendedCars;
