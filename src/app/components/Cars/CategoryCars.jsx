"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../Products/ProductCard";
import { client } from "@/sanity/lib/client";
import { ClipLoader } from "react-spinners";

const CategoryCars = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCars = async () => {
    try {
      const { categories, capacities, price } = filters;
      console.log("Filters:", filters); // Log the filters to see what is being passed

      let query = `*[_type == 'car' && price <= ${price}`;

      if (categories.length > 0) {
        query += ` && type->name in [${categories.map((c) => `"${c}"`).join(", ")}]`;
      }

      if (capacities.length > 0) {
        query += ` && seatingCapacity in [${capacities.join(", ")}]`;
      }

      query += `] | order(_createdAt asc) {
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

      console.log("Query:", query); // Log the query to see the final query

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
  }, [filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="#db4444" size={80} />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col mb-20">
      <div className="grid mt-6 gap-8  px-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:justify-items-center">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <div className="flex items-center">
        <button className="bg-[#3563E9] hover:bg-[#54A6FF] w-40 mt-20 py-3 mx-auto text-white text-center rounded-[5px]">
          Show more cars
        </button>
      </div>
    </div>
  );
};

export default CategoryCars;