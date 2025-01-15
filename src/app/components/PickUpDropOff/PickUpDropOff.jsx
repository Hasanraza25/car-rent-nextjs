import Image from "next/image";
import Link from "next/link";

const PickUpDropOff = () => {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1750px] px-4 flex flex-col items-center justify-center w-full xl:flex-row mt-5 xl:space-x-6">
        <div className="bg-white py-10 px-7 sm:p-6 rounded-lg shadow-md w-full xl:w-[45%] sm:mx-auto">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="pickup"
              className="mr-2 w-4 sm:w-6 h-4 sm:h-6 rounded-full border-2 border-gray-300 appearance-none checked:bg-blue-500 checked:ring-2 checked:ring-blue-500 focus:outline-none"
            />
            <label htmlFor="pickup" className="text-lg font-medium">
              Pick - Up
            </label>
          </div>

          <div className="flex flex-col md:flex-row items-center md:space-x-4">
            <div className="mb-4 md:mb-0 w-full relative border-r sm:border-none pr-5">
              <label
                htmlFor="location"
                className="block text-lg font-bold text-black"
              >
                Locations
              </label>
              <select
                id="location"
                className="lg:w-32 w-full py-2 mt-2 text-sm text-[#90A3BF] sm:p-4 rounded-md focus:outline-none appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
              >
                <option>Select your city</option>
                <option>City 1</option>
                <option>City 2</option>
                <option>City 3</option>
              </select>
            </div>

            <div className="mb-4 md:mb-0 w-full relative border-r sm:border-none pr-5">
              <label
                htmlFor="date"
                className="block text-lg font-bold text-black"
              >
                Date
              </label>
              <select
                id="date"
                className="lg:w-32 w-full py-2 mt-2  text-sm  text-[#90A3BF] sm:p-4 rounded-md focus:outline-none appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
              >
                <option>Select your Date</option>
                <option>2024-12-10</option>
                <option>2024-12-11</option>
                <option>2024-12-12</option>
              </select>
            </div>

            <div className="w-full relative pr-5">
              <label
                htmlFor="time"
                className="block text-lg font-bold text-black"
              >
                Time
              </label>
              <select
                id="time"
                className="lg:w-32 w-full py-2 mt-2  text-sm  text-[#90A3BF] sm:p-4 rounded-md focus:outline-none appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
              >
                <option>Select your Time</option>
                <option>10:00 AM</option>
                <option>02:00 PM</option>
                <option>04:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        <div className="md:my-8 sm:absolute bg-[#3563E9] p-4 rounded-xl cursor-pointer hover:bg-[#54A6FF] md:block hidden">
          <Image
            src="/images/topbottom-arrow.svg"
            alt="Icon"
            width={40}
            height={40}
          />
        </div>

        <div className="my-4 bg-[#3563E9] absolute p-4 rounded-xl cursor-pointer hover:bg-[#54A6FF] md:hidden">
          <Image
            src="/images/topbottom-arrow.svg"
            alt="Icon"
            width={40}
            height={40}
          />
        </div>

        <div className="bg-white py-10 px-7 sm:p-6 rounded-lg shadow-md w-full xl:w-[45%] mx-auto  sm:mt-10">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="pickup"
              className="mr-2 w-4 sm:w-6 h-4 sm:h-6 rounded-full border-2 border-gray-300 appearance-none checked:bg-blue-500 checked:ring-2 checked:ring-blue-500 focus:outline-none"
            />
            <label htmlFor="pickup" className="text-lg font-medium">
              Drop - Off
            </label>
          </div>

          <div className="flex flex-col md:flex-row items-center md:space-x-4">
            <div className="mb-4 md:mb-0 w-full relative border-r sm:border-none pr-5">
              <label
                htmlFor="location"
                className="block text-lg font-bold text-black"
              >
                Locations
              </label>
              <select
                id="location"
                className="lg:w-32 w-full py-2 mt-2 text-sm text-[#90A3BF] sm:p-4 rounded-md focus:outline-none appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
              >
                <option>Select your city</option>
                <option>City 1</option>
                <option>City 2</option>
                <option>City 3</option>
              </select>
            </div>

            <div className="mb-4 md:mb-0 w-full relative border-r sm:border-none pr-5">
              <label
                htmlFor="date"
                className="block text-lg font-bold text-black"
              >
                Date
              </label>
              <select
                id="date"
                className="lg:w-32 w-full py-2 mt-2 text-sm text-[#90A3BF] sm:p-4 rounded-md focus:outline-none appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
              >
                <option>Select your Date</option>
                <option>2024-12-10</option>
                <option>2024-12-11</option>
                <option>2024-12-12</option>
              </select>
            </div>

            <div className="w-full relative pr-5">
              <label
                htmlFor="time"
                className="block text-lg font-bold text-black"
              >
                Time
              </label>
              <select
                id="time"
                className="lg:w-32 w-full py-2 mt-2 text-sm text-[#90A3BF] sm:p-4 rounded-md focus:outline-none appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
              >
                <option>Select your Time</option>
                <option>10:00 AM</option>
                <option>02:00 PM</option>
                <option>04:00 PM</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PickUpDropOff;
