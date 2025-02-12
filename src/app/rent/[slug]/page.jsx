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
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pickupDate, setPickupDate] = useState(() => {
    const initialPickupDate = new Date();
    initialPickupDate.setHours(initialPickupDate.getHours() + 24);
    return initialPickupDate;
  });

  const [dropoffDate, setDropoffDate] = useState(() => {
    const initialDropoffDate = new Date();
    initialDropoffDate.setDate(initialDropoffDate.getDate() + 1);
    return initialDropoffDate;
  });

  const handleDaysChange = (value) => {
    const newDays = Math.max(1, Math.min(10, value));
    setDays(newDays);

    const newDropoffDate = new Date(pickupDate);
    newDropoffDate.setDate(newDropoffDate.getDate() + newDays);
    setDropoffDate(newDropoffDate);
  };

  const handleDropoffDateChange = (newDropoffDate) => {
    if (!(newDropoffDate instanceof Date)) {
      newDropoffDate = new Date(newDropoffDate);
    }

    if (isNaN(newDropoffDate.getTime())) {
      console.error("Invalid dropoff date:", newDropoffDate);
      return;
    }

    let maxDropoffDate = new Date(pickupDate);
    maxDropoffDate.setDate(maxDropoffDate.getDate() + 10);

    if (newDropoffDate > maxDropoffDate) {
      newDropoffDate = maxDropoffDate;
    }

    const newDays = Math.max(
      1,
      Math.ceil((newDropoffDate - pickupDate) / (1000 * 60 * 60 * 24))
    );

    setDays(newDays);
    setDropoffDate(newDropoffDate);
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
      <div className="mx-auto max-w-[1700px] px-4 flex flex-col lg:flex-row lg:my-10 space-y-6 lg:space-y-0 lg:space-x-10 mt-10">
        {car.stock > 0 ? (
          <>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                car={car}
                days={days}
                pickupDate={pickupDate}
                dropoffDate={dropoffDate}
                onSuccess={handleSuccess}
                onDropoffDateChange={handleDropoffDateChange}
                setDays={setDays}
              />
            </Elements>
            <div
              className="order-1 lg:order-2 w-full lg:w-1/3 bg-white h-full p-6 rounded-lg shadow-md"
              style={{ marginBottom: "2.5rem" }}
            >
              <div className="flex flex-col h-full">
                <h2 className="text-lg font-semibold text-black">
                  Rental Summary
                </h2>
                <p className="text-sm text-gray-300 mt-1 leading-6">
                  Prices may change depending on the length of the rental and
                  the price of your rental car.
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
                      <p className="text-sm text-gray-600 ml-4">
                        440+ Reviewer
                      </p>
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center px-3 mx-auto h-screen">
            <Image
              src="/images/no-cars-found.png"
              alt="No cars found"
              width={400}
              height={300}
              className="w-full max-w-md h-auto mb-6"
            />
            <h2 className="text-4xl font-bold text-gray-700 mb-2">
              🚫 Car Unavailable
            </h2>
            <p className="text-lg text-center max-w-md text-gray-500 mb-4">
              Sorry, this car is currently out of stock and cannot be rented at
              this time.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="animated-button text-white px-6 py-3 rounded-lg font-semibold shadow-lgtransition duration-300"
              >
                🔙 Go Back
              </button>

              <a
                href="/cars"
                className="animated-button text-white text-lg px-4 py-3 rounded-md shadow-md transition duration-300"
              >
                🚗 Browse Other Cars
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RentForm;
