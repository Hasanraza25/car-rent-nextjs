"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
const PickUpDropOff = () => {
  const [cities, setCities] = useState([]);
  const [pickupCity, setPickupCity] = useState("");
  const [dropoffCity, setDropoffCity] = useState("");
  const [pickupDate, setPickupDate] = useState(new Date());
  const [dropoffDate, setDropoffDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState("10:00 AM");
  const [dropoffTime, setDropoffTime] = useState("10:00 AM");
  useEffect(() => {
    fetchPakistanCities();
  }, []);
  const fetchPakistanCities = async () => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "Pakistan" }),
        }
      );
      const data = await response.json();
      setCities(data.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  const calculateMinDropoffDate = (pickupDate, pickupTime) => {
    const [time, modifier] = pickupTime.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    }
    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }
    const minDropoffDate = new Date(pickupDate);
    minDropoffDate.setHours(hours, minutes);
    minDropoffDate.setHours(minDropoffDate.getHours() + 24);
    return minDropoffDate;
  };
  const handlePickupDateChange = (date) => {
    setPickupDate(date);
    const minDropoffDate = calculateMinDropoffDate(date, pickupTime);
    setDropoffDate(minDropoffDate);
  };
  const handlePickupTimeChange = (time) => {
    setPickupTime(time);
    const minDropoffDate = calculateMinDropoffDate(pickupDate, time);
    setDropoffDate(minDropoffDate);
  };
  const handleDropoffDateChange = (date) => {
    const minDropoffDate = calculateMinDropoffDate(pickupDate, pickupTime);
    if (date < minDropoffDate) {
      setDropoffDate(minDropoffDate);
    } else {
      setDropoffDate(date);
    }
  };
  const handleDropoffTimeChange = (time) => {
    setDropoffTime(time);
  };
  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1750px] px-4 md:px-8 flex flex-col items-center justify-center w-full xl:flex-row mt-5 xl:space-x-6">
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
                className="w-full py-2 px-3 mt-2 text-sm  text-[#90A3BF] rounded-md focus:outline-none appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
              >
                <option>Select your city</option>
                {cities.map((city, index) => (
                  <option key={index} value={city} className="text-gray-600">
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 md:mb-0 w-full relative border-r sm:border-none pr-5">
              <label
                htmlFor="date"
                className="block text-lg font-bold text-black"
              >
                Date
              </label>
              <DatePicker
                selected={pickupDate}
                onChange={handlePickupDateChange}
                minDate={new Date()}
                placeholderText="Select your Date"
                className="lg:w-32 w-full py-2 mt-2 text-sm text-[#90A3BF] sm:p-4 rounded-md focus:outline-none appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
              />
            </div>
            <div className="w-full relative pr-5">
              <label className="block text-lg font-bold text-black">Time</label>
              <TimePicker
                onChange={handlePickupTimeChange}
                value={pickupTime}
                format="h:mm a"
                disableClock={true}
                clearIcon={null}
                className="w-full py-2 px-3 mt-2 text-sm text-[#90A3BF] rounded-md focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div
          className="md:my-8 sm:absolute bg-[#3563E9] p-4 rounded-xl cursor-pointer hover:bg-[#54A6FF] md:block hidden"
          onClick={() => {
            // Swap the pickup and dropoff locations
            setPickupCity(dropoffCity);
            setDropoffCity(pickupCity);
          }}
        >
          <Image
            src="/images/topbottom-arrow.svg"
            alt="Swap Icon"
            width={40}
            height={40}
          />
        </div>
        <div
          className="my-4 bg-[#3563E9] absolute p-4 rounded-xl cursor-pointer hover:bg-[#54A6FF] md:hidden"
          onClick={() => {
            // Swap the pickup and dropoff locations
            setPickupCity(dropoffCity);
            setDropoffCity(pickupCity);
          }}
        >
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
                className="w-full py-2 px-3 mt-2 text-sm  text-[#90A3BF] rounded-md focus:outline-none appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
                value={dropoffCity}
                onChange={(e) => setDropoffCity(e.target.value)}
              >
                <option value="">Select your city</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 md:mb-0 w-full relative border-r sm:border-none pr-5">
              <label
                htmlFor="date"
                className="block text-lg font-bold text-black"
              >
                Date
              </label>
              <DatePicker
                selected={dropoffDate}
                onChange={handleDropoffDateChange}
                minDate={calculateMinDropoffDate(pickupDate, pickupTime)}
                placeholderText="Select your Date"
                className="lg:w-32 w-full py-2 mt-2 text-sm z-40 text-[#90A3BF] sm:p-4 rounded-md focus:outline-none appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
              />
            </div>
            <div className="w-full relative pr-5">
              <label className="block text-lg font-bold text-black">Time</label>
              <TimePicker
                onChange={handleDropoffTimeChange}
                value={dropoffTime}
                format="h:mm a"
                disableClock={true}
                clearIcon={null}
                className="w-full py-2 px-3 mt-2 text-sm text-[#90A3BF] rounded-md focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PickUpDropOff;