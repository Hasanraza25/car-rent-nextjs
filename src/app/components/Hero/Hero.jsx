import React from "react";

const Hero = () => {
  return (
    <div className="mx-auto max-w-[1700px] px-4 mt-10">
      <div className="flex flex-wrap justify-center gap-6 lg:flex-nowrap">
        {/* First Card */}
        <div className="relative bg-[#54A6FF] text-white flex flex-col rounded-lg pt-8 pl-8 pb-4 w-full max-w-[670px] sm:px-6 lg:flex-1">
          <img
            src="/images/hero-ellipse.svg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-10"
          />
          <div className="relative z-10">
            <h1 className="text-white text-[2.2rem] sm:text-[1.8rem] leading-snug tracking-normal">
              The Best Platform for Car Rental
            </h1>
            <p className="text-lg mt-5">
              Ease of doing a car rental safely and reliably. Of course at a low price.
            </p>
            <button className="bg-[#3563E9] w-36 h-14 text-xl mt-8 rounded-md">
              Rental Car
            </button>
            <img
              src="/images/hero-car1.svg"
              alt="Car 1"
              className="mx-auto mt-8 w-[90%] sm:w-[70%] lg:w-[60%]"
            />
          </div>
        </div>

        {/* Second Card */}
        <div className="relative bg-[#3563E9] text-white flex flex-col rounded-lg pt-8 pl-8 pb-4 w-full max-w-[700px] sm:px-6 lg:flex-1">
          <img
            src="/images/hero-arrows.svg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-10"
          />
          <div className="relative z-10">
            <h1 className="text-white text-[2.2rem] sm:text-[1.8rem] leading-snug tracking-normal">
              Easy way to rent a car at a low price
            </h1>
            <p className="text-lg mt-5">
              Providing cheap car rental services and safe and comfortable facilities.
            </p>
            <button className="bg-[#54A6FF] w-36 h-14 text-xl mt-8 rounded-md">
              Rental Car
            </button>
            <img
              src="/images/hero-car2.svg"
              alt="Car 2"
              className="mx-auto mt-8 w-[90%] sm:w-[70%] lg:w-[60%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
