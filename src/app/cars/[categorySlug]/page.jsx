"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { client, urlFor } from "@/sanity/lib/client";
import ProductCard from "@/app/components/Products/ProductCard";
import Image from "next/image";

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
    <div className="container max-w-[1700px] mx-auto flex flex-col mb-20 my-5">
      <nav className="my-6 px-5 text-gray-600 text-xl">
        <Link href="/cars">
          <span className="text-[#3563E9] cursor-pointer">Cars</span>
        </Link>{" "}
        / <span className=" font-semibold">{category.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3 px-5">
        {category.name}{" "}
        <span className=" text-gray-500">
          &#40;&nbsp;{cars.length}&nbsp;&#41;
        </span>
      </h1>

      {cars.length === 0 ? (
        <div className="flex flex-col items-center justify-center mx-auto text-center px-3 my-10">
          <Image
            src="/images/no-cars-found.png" 
            alt="No cars found"
            width={400}
            height={300}
            className="w-full max-w-md h-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No cars available in this category
          </h2>
          <p className="text-gray-500 mb-4">
            There are no cars available in this category at the moment. Please
            check back later or explore other categories.
          </p>

          <Link
            href={"/"}
            className="bg-[#3563E9] hover:bg-[#54A6FF] py-3 px-6 text-white text-center rounded-md"
          >
            Return Home
          </Link>
        </div>
      ) : (
        <div className="grid mt-6 gap-6 px-5 sm:flex sm:flex-col sm:items-center md:grid md:grid-cols-2 lg:grid-cols-4">
          {cars.map((car, index) => (
            <ProductCard key={index} product={car} /> 
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
