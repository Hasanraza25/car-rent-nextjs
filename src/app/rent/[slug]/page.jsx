"use client";
import React, { useState, useEffect } from "react";
import { client, urlFor } from "@/sanity/lib/client";
import Image from "next/image";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/app/components/CheckoutForm/CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const RentForm = ({ params }) => {
  const slug = params.slug;
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickupTime, setPickupTime] = useState("10:00 AM");

  const initialPickupDate = new Date();
  initialPickupDate.setDate(initialPickupDate.getDate() + 1);
  initialPickupDate.setHours(10, 0, 0, 0);

  const calculateMinDropoffDate = (date, time) => {
    const [period, modifier] = time.split(" ");
    let [hours, minutes] = period.split(":");

    hours = parseInt(hours);
    if (modifier === "PM" && hours !== 12) hours += 12;
    // 10 pm 
    // 10 + 12 = 22 = 10 am
    // 12 pm = 12 pm
    if (modifier === "AM" && hours === 12) hours = 0;
    // 12 am
    // 12 + 0 = 12

    const minDate = new Date(date);
    minDate.setHours(hours, minutes);
    minDate.setDate(minDate.getDate() + 1);
    return minDate;
  };

  const [pickupDate, setPickupDate] = useState(initialPickupDate);
  const [dropoffDate, setDropoffDate] = useState(() => {
    const minDate = calculateMinDropoffDate(initialPickupDate, "10:00 AM");
    return minDate;
  });
  const [days, setDays] = useState(1);

  const calculateMaxDropoffDate = (pickupDate) => {
    const maxDate = new Date(pickupDate);
    maxDate.setDate(maxDate.getDate() + 10);
    return maxDate;
  };

  useEffect(() => {
    const diffTime = dropoffDate - pickupDate;
    const initialDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDays(initialDays);
  }, []);

  const updateDates = (newPickupDate, newPickupTime) => {
    const minDropoff = calculateMinDropoffDate(newPickupDate, newPickupTime);
    const newDropoff = new Date(
      minDropoff.getTime() + (days - 1) * 24 * 60 * 60 * 1000
    );

    if (newDropoff < minDropoff) {
      setDropoffDate(minDropoff);
      setDays(1);
    } else {
      setDropoffDate(newDropoff);
    }
  };

  const handlePickupDateChange = (newPickupDate) => {
    const minDropoff = calculateMinDropoffDate(newPickupDate, pickupTime);
    const newDropoff = new Date(
      minDropoff.getTime() + (days - 1) * 24 * 60 * 60 * 1000
    );

    setPickupDate(newPickupDate);
    setDropoffDate(newDropoff);
  };

  useEffect(() => {
    const minDropoff = calculateMinDropoffDate(pickupDate, pickupTime);
    if (dropoffDate < minDropoff) {
      setDropoffDate(minDropoff);
    }
  }, [pickupTime]);

  const handleDropoffDateChange = (newDropoffDate) => {
    const minDropoff = calculateMinDropoffDate(pickupDate, pickupTime);
    const maxDropoff = calculateMaxDropoffDate(pickupDate);

    if (newDropoffDate < minDropoff) {
      newDropoffDate = minDropoff;
    }
    if (newDropoffDate > maxDropoff) {
      newDropoffDate = maxDropoff;
    }

    const diffTime = newDropoffDate - pickupDate;
    const newDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setDays(newDays);
    setDropoffDate(newDropoffDate);
  };
  const handleDaysChange = (newDays) => {
    newDays = Math.max(1, Math.min(10, newDays));
    setDays(newDays);

    const minDropoff = calculateMinDropoffDate(pickupDate, pickupTime);
    let newDropoff = new Date(
      minDropoff.getTime() + (newDays - 1) * 24 * 60 * 60 * 1000
    );

    const maxDropoff = calculateMaxDropoffDate(pickupDate);
    if (newDropoff > maxDropoff) {
      newDropoff = maxDropoff;
      setDays(10);
    }

    setDropoffDate(newDropoff);
  };

  const getCars = async () => {
    try {
      setLoading(true);
      const query = `*[_type == 'car']{
        _id,
        name,
        type,
        price,
        stock,
        image,
        discount,
        steering,
        fuelCapacity,
        seatingCapacity,
        description,
        "currentSlug": slug.current,
        "categorySlug": type->slug.current,          
      }`;

      const products = await client.fetch(query);
      const foundCar = products.find((car) => car.currentSlug === slug);

      setCar(foundCar || null);
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg font-semibold">Car not found</p>
      </div>
    );
  }

  const handleSuccess = (reservation) => {
    window.location.href = `/payment-success?reservation_id=${reservation._id}`;
  };

  return (
    <>
      <div className="mx-auto max-w-[1700px] px-4 flex flex-col lg:flex-row lg:my-10 space-y-6 lg:space-y-0 lg:space-x-10">
        <Elements stripe={stripePromise}>
          <CheckoutForm
            car={car}
            days={days}
            pickupTime={pickupTime}
            onPickupTimeChange={setPickupTime}
            pickupDate={pickupDate}
            dropoffDate={dropoffDate}
            onSuccess={handleSuccess}
            onPickupDateChange={handlePickupDateChange}
            onDropoffDateChange={handleDropoffDateChange}
            setDays={setDays}
            maxDropoffDate={calculateMaxDropoffDate(pickupDate)}
          />
        </Elements>

        <div
          className="order-1 lg:order-2 w-full lg:w-1/3 bg-white h-full p-6 rounded-lg shadow-md"
          style={{ marginBottom: "2.5rem" }}
        >
          <div className="flex flex-col h-full">
            <h2 className="text-lg font-semibold text-black">Rental Summary</h2>
            <p className="text-sm text-gray-300 mt-1 leading-6">
              Prices may change depending on the length of the rental and the
              price of your rental car.
            </p>

            <div className="flex flex-wrap mobile:justify-center items-center mt-6 mobile:gap-2">
              <div className="flex flex-wrap items-center mobile:justify-center mobile:gap-2 relative w-20 h-20">
                <div
                  className="absolute inset-0 bg-cover bg-center rounded-lg"
                  style={{
                    backgroundImage: "url('/images/look.svg')",
                  }}
                ></div>
                {car.image == null ? (
                  <div className="loader"></div>
                ) : (
                  <Image
                    src={car.image ? urlFor(car.image).url() : ""}
                    alt={car.name}
                    className="w-20 h-20 object-contain z-10 m-auto"
                    width={80}
                    height={80}
                    priority
                  />
                )}
              </div>

              <div className="md:ml-4 mobile:text-center mobile:gap-2">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {car.name}
                </h3>
                <div className="flex items-center justify-center mt-2">
                  <img src="/images/review-stars.svg" alt="" />
                  <p className="text-sm text-gray-600 ml-4">440+ Reviewer</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-base font-medium text-gray-700">
                Number of Days (Max 10)
              </label>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleDaysChange(days - 1)}
                  className="px-3 py-2 bg-gray-200 rounded-lg text-black"
                  disabled={days <= 1}
                >
                  -
                </button>
                <span className="text-lg font-semibold">{days}</span>
                <button
                  onClick={() => handleDaysChange(days + 1)}
                  className="px-3 py-2 bg-gray-200 rounded-lg text-black"
                  disabled={days >= 10}
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-8">
              <div className="flex justify-between text-base text-gray-400 mb-4">
                <p>Subtotal</p>
                <p className="text-black">${car.price * days}.00</p>
              </div>
              <div className="flex justify-between text-base text-gray-400 mb-4">
                <p>Tax</p>
                <p className="text-black">$0</p>
              </div>
              <div className="relative flex items-center space-x-4 mt-8">
                <input
                  type="text"
                  placeholder="Apply promo code"
                  className="flex-1 bg-gray-100 rounded-lg px-5 py-3 text-lg sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="absolute right-0 bg-transparent text-black px-4 py-2 rounded-lg text-lg sm:text-sm">
                  Apply now
                </button>
              </div>
            </div>

            <div className="mt-6 border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold text-gray-800">
                  Total Rental Price
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  ${car.price * days}.00
                </p>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Overall price and includes rental discount
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RentForm;
