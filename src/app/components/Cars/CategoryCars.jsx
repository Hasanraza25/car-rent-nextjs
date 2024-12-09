import React from "react";
import ProductCard from "../Products/ProductCard";

const CategoryCars = () => {
  const products = [
    {
      image: "/images/cars/car-1.svg",
      name: "Toyota Corolla",
      price: 60,
      discount: "$70.00",
      category: "Sedan",
      genre: "Automatic",
      litres: 50,
      people: 4,
    },
    {
      image: "/images/cars/car-2.svg",
      name: "Honda Civic",
      price: 75,
      discount: "$85.00",
      category: "Sedan",
      genre: "Manual",
      litres: 55,
      people: 5,
    },
    {
      image: "/images/cars/car-3.svg",
      name: "BMW 3 Series",
      price: 90,
      discount: "",
      category: "Coupe",
      genre: "Automatic",
      litres: 60,
      people: 4,
    },
    {
      image: "/images/cars/car-4.svg",
      name: "Ford Mustang",
      price: 120,
      discount: "",
      category: "Sport",
      genre: "Manual",
      litres: 70,
      people: 2,
    },
    {
      image: "/images/cars/car-5.svg",
      name: "Nissan Altima",
      price: 65,
      discount: "$70.00",
      category: "Sedan",
      genre: "Automatic",
      litres: 50,
      people: 5,
    },
    {
      image: "/images/cars/car-6.svg",
      name: "Audi A4",
      price: 100,
      discount: "",
      category: "Sedan",
      genre: "Automatic",
      litres: 60,
      people: 4,
    },
    {
        image: "/images/cars/car-4.svg",
        name: "Ford Mustang",
        price: 120,
        discount: "",
        category: "Sport",
        genre: "Manual",
        litres: 70,
        people: 2,
      },
      {
        image: "/images/cars/car-5.svg",
        name: "Nissan Altima",
        price: 65,
        discount: "$70.00",
        category: "Sedan",
        genre: "Automatic",
        litres: 50,
        people: 5,
      },
      {
        image: "/images/cars/car-6.svg",
        name: "Audi A4",
        price: 100,
        discount: "",
        category: "Sedan",
        genre: "Automatic",
        litres: 60,
        people: 4,
      },
  ];

  return (
    <div className="container mx-auto flex flex-col mb-20">
      {/* Centered grid layout on mobile */}
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
