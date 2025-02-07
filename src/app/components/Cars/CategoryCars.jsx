"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../Products/ProductCard";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";

const CategoryCars = ({ filters, carsSectionRef }) => {
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
        "categorySlug": type->slug.current
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
        <div className="loader"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-3 my-10">
        <Image
          src="/images/no-cars-found.png" // Replace with the actual path to your image
          alt="No cars found"
          width={400}
          height={300}
          className="w-full max-w-md h-auto mb-6"
        />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          No Cars Found!
        </h2>
        <p className="text-gray-500 mb-4">
          We couldn&#34;t find any cars that match your filters. Try adjusting
          the filters to see more options.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#3563E9] hover:bg-[#54A6FF] py-3 px-6 text-white text-center rounded-md"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col mb-20" ref={carsSectionRef}>
      <div className="grid mt-6 gap-8 px-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:justify-items-center">
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

export default CategoryCars;