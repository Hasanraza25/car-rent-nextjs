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

  const litresIcon = "/images/gas-station.svg";
  const genreIcon = "/images/handle.svg";
  const peopleIcon = "/images/profile-2.svg";

  const car = cars.find(
    (car) => car.name.toLowerCase().replace(/ /g, "-") === slug
  );

  if (!car) {
    return <div>Car not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col w-full px-4">
          <div className="flex flex-wrap justify-around mt-10 mx-auto">
            {/* Card 1 */}
            <div className="relative rounded-lg text-white flex flex-col justify-between p-6 mb-8 w-full sm:w-full md:w-[45%] xl:w-[45%] ">
              <img
                src="/images/hero-arrows.svg"
                alt="Background"
                className="absolute inset-0 w-full h-[70%] object-cover rounded-lg"
              />
              <div className="relative z-10">
                <h1 className="text-white text-[2.3rem] sm:text-[1.8rem] w-[20rem] leading-snug">
                  Sports car with the best design and acceleration
                </h1>
                <p className="md:w-80 text-lg mt-5 leading-7 font-light">
                  Safety and comfort while driving a futuristic and elegant
                  sports car
                </p>
                <img
                  src={car.image}
                  alt="Car 2"
                  className="mx-auto mt-10 sm:mt-10 pb-10"
                  width="400px"
                />
              </div>

              {/* Flex for 3 smaller images */}
              <div className="flex mt-8 space-x-6 sm:w-full md:w-auto justify-center">
                <img
                  src="/images/car-view-1.svg"
                  alt="Car View 1"
                  className="sm:w-[10rem] sm:h-[5rem]"
                />
                <img
                  src="/images/car-view-2.svg"
                  alt="Car View 2"
                  className="sm:w-[10rem] sm:h-[5rem]"
                />
                <img
                  src="/images/car-view-3.svg"
                  alt="Car View 3"
                  className="sm:w-[10rem] sm:h-[5rem]"
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className=" relative w-full sm:w-full lg:w-1/2 rounded-lg bg-white shadow-md mb-8 md:w-[45%] xl:w-[45%]">
              <div className="p-6">
                <Link
                  href={`/cars/${car.name.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  <h3 className="text-3xl font-semibold cursor-pointer">
                    {car.name}
                  </h3>
                </Link>
                <div className="flex mt-2">
                  <img src="/images/review-stars.svg" alt="Review Stars" />
                  <p className="ml-3 text-gray-400 text-sm">440+ Reviewer</p>
                </div>
                <p className="text-gray-400 mt-7 text-lg leading-9 font-normal">
                  NISMO has become the embodiment of Nissan&#39;s outstanding
                  performance, inspired by the "race track".
                </p>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-2 flex flex-col space-y-2">
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

              {/* Litres, Genre, and People */}
              <div className="flex flex-wrap justify-between mx-8 mt-2 space-x-6">
                <div className="flex items-center space-x-4 text-[#90A3BF]">
                  <span className="text-lg">Type Car</span>
                  <span className="text-lg text-gray-600">{car.category}</span>
                </div>
                <div className="flex items-center space-x-4 text-[#90A3BF]">
                  <span className="text-lg">Capacity</span>
                  <span className="text-lg text-gray-600">
                    {car.people} Person
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap justify-between mx-8 mt-2 space-x-6">
                <div className="flex items-center space-x-4 text-[#90A3BF]">
                  <span className="text-lg">Steering</span>
                  <span className="text-lg text-gray-600">{car.genre}</span>
                </div>
                <div className="flex items-center space-x-4 text-[#90A3BF]">
                  <span className="text-lg">Gasoline</span>
                  <span className="text-lg text-gray-600">{car.litres}L</span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mt-8 p-4 m-3">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-[#90A3BF]">
                    <span className="text-black text-3xl font-bold">
                      ${car.price}.00/
                    </span>{" "}
                    days
                  </span>
                  <button className="bg-[#3563E9] hover:bg-[#54A6FF] py-4 px-6 text-white rounded-[5px]">
                    Rent Now
                  </button>
                </div>
                <span className="text-[#90A3BF] text-lg line-through">
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
