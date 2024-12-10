"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/app/components/Header/Header";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import Footer from "@/app/components/Footer/Footer";
import Link from "next/link";
import CategoryCars from "@/app/components/Cars/CategoryCars";
import ReviewsSection from "@/app/components/ReviewSection/ReviewSection";
import RecentCars from "@/app/components/Cars/RecentCars";
import cars from "@/app/cars";

const CarDetail = () => {
  const pathname = usePathname();
  const slug = pathname?.split("/").pop();

  const [isHeartClicked, setIsHeartClicked] = useState(false);

  const heartUnfilled = "/images/heart-unfilled.svg";
  const heartFilled = "/images/heart-filled.svg";

  const car = cars.find(
    (car) =>
      car.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") === slug
  );

  if (!car) {
    return <div>Car not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar />
        <div className="flex flex-col w-full px-4 sm:px-2">
          <div className="flex flex-col md:flex-row flex-wrap justify-around mt-10 mx-auto w-full max-w-[1400px]">
            {/* Card 1 */}
            <div className="relative rounded-lg text-white flex flex-col justify-between p-6 mb-8 w-full sm:w-[90%] md:w-[45%] mx-auto">
              <img
                src="/images/hero-arrows.svg"
                alt="Background"
                className="absolute inset-0 w-full h-[70%] object-cover rounded-lg"
              />
              <div className="relative z-10 ">
                <h1 className="text-white text-[2.5rem] sm:text-[1.5rem]  w-[80%] leading-snug ">
                  Sports car with the best design and acceleration
                </h1>
                <p className="text-lg mt-5 leading-8 font-light w-[60%]">
                  Safety and comfort while driving a futuristic and elegant
                  sports car
                </p>
                <img
                  src={car.image}
                  alt="Car"
                  className="mx-auto mt-6 sm:mt-4 w-full max-w-[500px] rounded-lg"
                />
              </div>

              {/* Flex for 3 smaller images */}
              <div className="flex mt-32 space-x-4 justify-center">
                <img
                  src="/images/car-view-1.svg"
                  alt="Car View 1"
                  className="w-[200px] h-[120px] sm:w-[100px]"
                />
                <img
                  src="/images/car-view-2.svg"
                  alt="Car View 2"
                  className="w-[200px] h-[120px] sm:w-[100px]"
                />
                <img
                  src="/images/car-view-3.svg"
                  alt="Car View 3"
                  className="w-[200px] h-[120px] sm:w-[100px]"
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative w-full md:w-[45%] bg-white shadow-md rounded-lg mx-auto p-4 h-[80%]">
              <div className="p-3">
                <Link
                  href={`/cars/${car.name.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  <h3 className="text-4xl font-semibold cursor-pointer">
                    {car.name}
                  </h3>
                </Link>
                <div className="flex mt-3">
                  <img src="/images/review-stars.svg" alt="Review Stars" />
                  <p className="ml-3 text-gray-400 text-sm">440+ Reviewier</p>
                </div>
                <p className="text-gray-500 mt-5 text-[1.3rem] leading-10 font-normal">
                  NISMO has become the embodiment of Nissan&#39;s outstanding
                  performance, inspired by the most unforgiving proving ground,
                  the &quot;race track&quot;.
                </p>
              </div>

              <div className="absolute top-6 right-4">
                <button
                  className="bg-white w-8 h-8 rounded-full flex items-center justify-center hover:text-red-500"
                  onClick={() => setIsHeartClicked(!isHeartClicked)}
                >
                  <img
                    src={isHeartClicked ? heartFilled : heartUnfilled}
                    alt="Heart Icon"
                    className="w-6 h-6"
                  />
                </button>
              </div>

              <div className="flex flex-col md:flex-row justify-between mx-2 mt-3 space-y-2 md:space-y-0 md:space-x-4 text-sm text-[#90A3BF]">
                <div className="flex items-center justify-between w-full text-lg">
                  <span>Type Car:</span>
                  <span className="text-gray-600">{car.category}</span>
                </div>
                <div className="flex items-center justify-between w-full text-lg">
                  <span>Capacity:</span>
                  <span className="text-gray-600">{car.people} Person</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between mx-2 mt-2 space-y-2 md:space-y-0 md:space-x-4 text-sm text-[#90A3BF]">
                <div className="flex items-center justify-between w-full text-lg">
                  <span>Steering:</span>
                  <span className="text-gray-600">{car.genre}</span>
                </div>
                <div className="flex items-center justify-between w-full text-lg">
                  <span>Gasoline:</span>
                  <span className="text-gray-600">{car.litres}L</span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mt-10 text-center">
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-[#90A3BF] text-xl ml-2">
                    <span className="text-black text-3xl font-bold">
                      ${car.price}.00/
                    </span>{" "}
                    days
                  </span>
                  <button className="bg-[#3563E9] hover:bg-[#54A6FF] py-3 px-5 text-white text-lg rounded-md">
                    Rent Now
                  </button>
                </div>
                <span className="text-[#90A3BF] text-sm line-through">
                  {car.discount}
                </span>
              </div>
            </div>
          </div>

          <ReviewsSection />
          <RecentCars />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CarDetail;
