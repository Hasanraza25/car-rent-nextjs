"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const PickUpDropOff = () => {
  const [cities, setCities] = useState([]);
  const [pickupCity, setPickupCity] = useState("");
  const [dropoffCity, setDropoffCity] = useState("");
  const [pickupDate, setPickupDate] = useState(new Date());
  const [dropoffDate, setDropoffDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState("10:00 AM");
  const [dropoffTime, setDropoffTime] = useState("10:00 AM");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch("/api/fetchCities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setCities(data);
        } else {
          console.error("Error fetching cities:", data.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setIsLoading(false); // Stop loading after fetch
      }
    };

    fetchCities();
  }, []);

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
                Location
              </label>
              <select
                id="pickupCity"
                className="w-full py-2 px-3 mt-2 text-sm  text-gray-600 rounded-md focus:outline-none cursor-pointer appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                disabled={isLoading} // Disable dropdown while loading
              >
                {isLoading ? (
                  <option>Loading cities...</option> // Show loading text
                ) : (
                  <>
                    <option value="">Select your city</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div className="mb-4 md:mb-0 w-full relative border-r sm:border-none pr-5">
              <label
                htmlFor="date"
                className="block text-lg font-bold text-black"
              >
                Date
              </label>
              <Flatpickr
                options={{
                  enableTime: false, // Only date selection
                  dateFormat: "Y-m-d", // Format: YYYY-MM-DD
                  minDate: "today", // Prevent past dates
                  clickOpens: true, // Open only when clicked
                }}
                className="lg:w-32 w-full py-2 mt-2 text-sm text-gray-600 sm:p-4 rounded-md focus:outline-none appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
                placeholder="Select your Date"
                value={pickupDate}
                onChange={handlePickupDateChange}
              />
            </div>
            <div className="w-full relative pr-5">
              <label className="block text-lg font-bold text-black">Time</label>
              <Flatpickr
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "h:i K", // 12-hour format with AM/PM
                  time_24hr: false,
                  minuteIncrement: 5, // Adjust for smooth scrolling
                }}
                className="w-full py-2 px-3 mt-2 text-sm text-gray-600 rounded-md focus:outline-none"
                value={pickupTime}
                onChange={(selectedDates) =>
                  setPickupTime(
                    selectedDates[0].toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  )
                }
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
        <div className="bg-white py-10 px-7 sm:p-6 rounded-lg shadow-md w-full xl:w-[45%] mx-auto sm:mt-10">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="dropoff"
              className="mr-2 w-4 sm:w-6 h-4 sm:h-6 rounded-full border-2 border-gray-300 appearance-none checked:bg-blue-500 checked:ring-2 checked:ring-blue-500 focus:outline-none"
            />
            <label htmlFor="dropoff" className="text-lg font-medium">
              Drop - Off
            </label>
          </div>
          <div className="flex flex-col md:flex-row items-center md:space-x-4">
            <div className="mb-4 md:mb-0 w-full relative border-r sm:border-none pr-5">
              <label
                htmlFor="location"
                className="block text-lg font-bold text-black"
              >
                Location
              </label>
              <select
                className="w-full py-2 px-3 mt-2 text-sm  text-gray-600 rounded-md focus:outline-none cursor-pointer appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
                value={dropoffCity}
                onChange={(e) => setDropoffCity(e.target.value)}
              >
                {isLoading ? (
                  <option>Loading cities...</option> // Show loading text
                ) : (
                  <>
                    <option value="">Select your city</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div className="mb-4 md:mb-0 w-full relative border-r sm:border-none pr-5">
              <label
                htmlFor="date"
                className="block text-lg font-bold text-black"
              >
                Date
              </label>
              <Flatpickr
                options={{
                  enableTime: false, // Only date selection
                  dateFormat: "Y-m-d", // Format: YYYY-MM-DD
                  minDate: calculateMinDropoffDate(pickupDate, pickupTime), // Prevent past dates
                  clickOpens: true, // Open only when clicked
                }}
                className="lg:w-32 w-full py-2 mt-2 text-sm text-gray-600 sm:p-4 rounded-md focus:outline-none appearance-none bg-[url('/images/arrow-down.svg')] bg-no-repeat bg-right bg-[length:1rem]"
                placeholder="Select your Date"
                value={dropoffDate}
                onChange={handleDropoffDateChange}
              />
            </div>
            <div className="w-full relative pr-5">
              <label className="block text-lg font-bold text-black">Time</label>
              <Flatpickr
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "h:i K", // 12-hour format with AM/PM
                  time_24hr: false,
                  minuteIncrement: 5, // Adjust for smooth scrolling
                }}
                className="w-full py-2 px-3 mt-2 text-sm text-gray-600 rounded-md focus:outline-none "
                onChange={handleDropoffTimeChange}
                value={dropoffTime}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Link href="/cars" className="mx-auto">
          <button className="animated-button text-lg w-60 mt-10 py-4 mx-auto text-white text-center rounded-[5px]">
            Check Available Cars
          </button>
        </Link>
      </div>
    </section>
  );
};

export default PickUpDropOff;