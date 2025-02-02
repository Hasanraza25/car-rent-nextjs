"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { client, urlFor } from "@/sanity/lib/client";
import ProductCard from "@/app/components/Products/ProductCard";

const CategoryPage = ({ params }) => {
  const { categorySlug } = params;
  const [cars, setCars] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCategoryData = async () => {
    try {
      setLoading(true);

      const categoryQuery = `*[_type == 'categories' && slug.current == $categorySlug][0]`;
      const fetchedCategory = await client.fetch(categoryQuery, {
        categorySlug,
      });

      if (!fetchedCategory) {
        setCategory(null);
        setLoading(false);
        return;
      }

      setCategory(fetchedCategory);

      const carsQuery = `*[_type == 'car' && type->slug.current == $categorySlug]{
        name,
        "category": type->name,
        price,
        stock,
        image,
        discount,
        steering,
        fuelCapacity,
        seatingCapacity,
        "currentSlug": slug.current,
        "categorySlug": type->slug.current
      }`;

      const fetchedCars = await client.fetch(carsQuery, { categorySlug });

      setCars(fetchedCars);
    } catch (err) {
      console.error("Error fetching category or cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center text-2xl font-bold mt-10">
        Category not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 md:px-10 my-20">
      <nav className="my-6 text-gray-600 text-xl">
        <Link href="/cars">
          <span className="text-[#3563E9] cursor-pointer">Cars</span>
        </Link>{" "}
        / <span className=" font-semibold">{category.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">
        {category.name}{" "}
        <span className=" text-gray-500">
          &#40;&nbsp;{cars.length}&nbsp;&#41;
        </span>
      </h1>

      <div className="w-full my-6 relative mx-auto">
        <div
          className="grid mt-6 gap-6 px-5 md:grid md:grid-cols-2 lg:grid-cols-3
      mobile:overflow-x-auto 
      mobile:grid-cols-[auto] 
      mobile:grid-flow-col"
        >
          {cars.length === 0 ? (
            <p className="text-center text-lg col-span-full">
              No cars available in this category
            </p>
          ) : (
            cars.map((car, index) => <ProductCard key={index} product={car} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
