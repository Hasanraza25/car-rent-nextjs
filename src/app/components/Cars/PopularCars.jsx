"use client"
import React, { useEffect, useState } from "react";
import ProductCard from "../Products/ProductCard";
import { client } from "@/sanity/lib/client";

const PopularCars = () => {
  const [products, setProducts] = useState([]);

  const getCars = async () => {
    try {
      const query = `*[_type == 'car' && 'popular' in section ] | order(_createdAt asc)`;
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
    <>
      <div className="container max-w-[1700px] mx-auto flex flex-col mb-20">
        <div className="flex mt-10 items-center font-bold justify-between px-5">
          <h4 className="text-xl text-[#90A3BF] font-semibold">Popular Cars</h4>
          <div>
            <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline">
              View All
            </button>
          </div>
        </div>

        <div className="w-full mt-6 relative mx-auto">
          <div
            className="
            grid mt-6 gap-6 px-5 md:grid md:grid-cols-2 lg:grid-cols-4
      mobile:overflow-x-auto 
      mobile:grid-cols-[auto] 
      mobile:grid-flow-col
      
    "
          >
            {products.map((product, index) => (
              <div
                key={index}
                className="
          flex-shrink-0 sm:w-[20rem]
        "
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PopularCars;
