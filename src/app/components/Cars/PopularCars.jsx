"use client";
import React, { Suspense, useEffect, useState } from "react";
import ProductCard from "../Products/ProductCard";
import { client } from "@/sanity/lib/client";
import { ClipLoader } from "react-spinners";

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

  if (loading) {
    return (
      <>
        <div className="container max-w-[1700px] mx-auto flex flex-col">
          <div className="flex mt-10 items-center font-bold justify-between px-5">
            <h4 className="text-xl text-[#90A3BF] font-semibold">
              Popular Cars
            </h4>
            <div>
              <button className="py-4 text-[#3563E9] rounded-[5px] hover:underline">
                View All
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#db4444" size={80} />
        </div>
      </>
    );
  }
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
            <Suspense fallback={<ClipLoader size={50} color="#3563E9" />}>
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
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopularCars;
