"use client";
import Footer from "@/app/components/Footer/Footer";
import Header from "@/app/components/Header/Header";
import React from "react";
import cars from "@/app/cars";
import { usePathname } from "next/navigation";
const RentForm = () => {
  const pathname = usePathname();

  const slug = pathname?.split("/").pop();

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
    <>
      <Header />
      <div className="mx-auto max-w-[1700px] px-4 flex flex-col lg:flex-row lg:my-10 space-y-6 lg:space-y-0 lg:space-x-10">
        <div className="order-2 lg:order-1 w-full lg:w-2/3 flex flex-col space-y-6 lg:space-y-10">
          <div className="w-full bg-white h-full p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Billing Info
              </h2>
              <p className="text-sm text-gray-400">Step 1 of 4</p>
            </div>
            <p className="text-base text-gray-300 -mt-4 mb-6">
              Please enter your billing info
            </p>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-base font-medium text-black"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your name"
                    className="mt-4 block w-full p-5 pl-7 rounded-md bg-gray-100 text-gray-300 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-base font-medium text-black"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    placeholder="Phone number"
                    className="mt-4 block w-full p-5 pl-7 rounded-md bg-gray-100 text-gray-300 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-base font-medium text-black"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    placeholder="Address"
                    className="mt-4 block w-full p-5 pl-7 rounded-md bg-gray-100 text-gray-300 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-base font-medium text-black"
                  >
                    Town / City
                  </label>
                  <input
                    type="text"
                    id="city"
                    placeholder="Town or city"
                    className="mt-4 block w-full p-5 pl-7 rounded-md bg-gray-100 text-gray-300 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="w-full max-w-6xl bg-white h-full p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Rental Info
              </h2>
              <p className="text-sm text-gray-400">Step 2 of 4</p>
            </div>
            <p className="text-base text-gray-300 -mt-4 mb-6">
              Please select your rental date
            </p>

            <form>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="pickup"
                    name="rental"
                    className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    defaultChecked
                  />
                  <label
                    htmlFor="pickup"
                    className="ml-3 text-lg font-medium text-gray-800"
                  >
                    Pick – Up
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="pickup-location"
                      className="block text-base font-medium text-black"
                    >
                      Locations
                    </label>
                    <div className="relative mt-4">
                      <select
                        id="pickup-location"
                        className="block w-full p-5 pl-7 pr-10 rounded-md bg-gray-100 text-gray-500 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none"
                        style={{
                          backgroundImage:
                            'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27gray%27%3E%3Cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3E%3C/svg%3E")',
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.5em",
                        }}
                      >
                        <option>Select your city</option>
                        <option>New York</option>
                        <option>Los Angeles</option>
                        <option>Chicago</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="pickup-date"
                      className="block text-base font-medium text-black"
                    >
                      Date
                    </label>
                    <div className="relative mt-4">
                      <select
                        id="pickup-date"
                        className="block w-full p-5 pl-7 pr-10 rounded-md bg-gray-100 text-gray-500 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none"
                        style={{
                          backgroundImage:
                            'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27gray%27%3E%3Cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3E%3C/svg%3E")',
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.5em",
                        }}
                      >
                        <option>Select your date</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="pickup-time"
                      className="block text-base font-medium text-black"
                    >
                      Time
                    </label>
                    <div className="relative mt-4">
                      <select
                        id="pickup-time"
                        className="block w-full p-5 pl-7 pr-10 rounded-md bg-gray-100 text-gray-500 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none"
                        style={{
                          backgroundImage:
                            'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27gray%27%3E%3Cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3E%3C/svg%3E")',
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.5em",
                        }}
                      >
                        <option>Select your time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="dropoff"
                    name="rental"
                    className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="dropoff"
                    className="ml-3 text-lg font-medium text-gray-800"
                  >
                    Drop – Off
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="dropoff-location"
                      className="block text-base font-medium text-black"
                    >
                      Locations
                    </label>
                    <div className="relative mt-4">
                      <select
                        id="dropoff-location"
                        className="block w-full p-5 pl-7 pr-10 rounded-md bg-gray-100 text-gray-500 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none"
                        style={{
                          backgroundImage:
                            'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27gray%27%3E%3Cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3E%3C/svg%3E")',
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.5em",
                        }}
                      >
                        <option>Select your city</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="dropoff-date"
                      className="block text-base font-medium text-black"
                    >
                      Date
                    </label>
                    <div className="relative mt-4">
                      <select
                        id="dropoff-date"
                        className="block w-full p-5 pl-7 pr-10 rounded-md bg-gray-100 text-gray-500 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none"
                        style={{
                          backgroundImage:
                            'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27gray%27%3E%3Cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3E%3C/svg%3E")',
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.5em",
                        }}
                      >
                        <option>Select your date</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="dropoff-time"
                      className="block text-base font-medium text-black"
                    >
                      Time
                    </label>
                    <div className="relative mt-4">
                      <select
                        id="dropoff-time"
                        className="block w-full p-5 pl-7 pr-10 rounded-md bg-gray-100 text-gray-500 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none"
                        style={{
                          backgroundImage:
                            'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27gray%27%3E%3Cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3E%3C/svg%3E")',
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.5em",
                        }}
                      >
                        <option>Select your time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="w-full bg-white h-full p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Payment Method
              </h2>
              <p className="text-sm text-gray-400">Step 3 of 4</p>
            </div>
            <p className="text-base text-gray-300 -mt-4 mb-6">
              Please enter your payment method
            </p>

            <form>
              <div className="p-4 bg-gray-100 rounded-lg mb-6">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="creditCard"
                    name="paymentMethod"
                    className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    defaultChecked
                  />
                  <label
                    htmlFor="creditCard"
                    className="ml-3 my-3 text-lg font-medium text-gray-800"
                  >
                    Credit Card
                  </label>
                  <div className="ml-auto flex items-center">
                    <img
                      src="/images/visa-icon.svg"
                      alt="Visa"
                      className="h-6 w-auto mr-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="block text-base font-medium text-black"
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      placeholder="Card number"
                      className="mt-4 block w-full p-5 rounded-md bg-white text-gray-600 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="expirationDate"
                      className="block text-base font-medium text-black"
                    >
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      id="expirationDate"
                      placeholder="DD / MM / YY"
                      className="mt-4 block w-full p-5 rounded-md bg-white text-gray-600 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cardHolder"
                      className="block text-base font-medium text-black"
                    >
                      Card Holder
                    </label>
                    <input
                      type="text"
                      id="cardHolder"
                      placeholder="Card holder"
                      className="mt-4 block w-full p-5 rounded-md bg-white text-gray-600 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cvc"
                      className="block text-base font-medium text-black"
                    >
                      CVC
                    </label>
                    <input
                      type="text"
                      id="cvc"
                      placeholder="CVC"
                      className="mt-4 block w-full p-5 rounded-md bg-white text-gray-600 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-4 bg-gray-100 p-5 rounded-lg">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="paypal"
                  className="ml-3 text-lg font-medium text-gray-800"
                >
                  PayPal
                </label>
                <img
                  src="/images/paypal-icon.svg"
                  alt="PayPal"
                  className="h-6 w-auto ml-auto"
                />
              </div>

              <div className="flex items-center bg-gray-100 p-5 rounded-lg">
                <input
                  type="radio"
                  id="bitcoin"
                  name="paymentMethod"
                  className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="bitcoin"
                  className="ml-3 text-lg font-medium text-gray-800"
                >
                  Bitcoin
                </label>
                <img
                  src="/images/bitcoin-icon.svg"
                  alt="Bitcoin"
                  className="h-6 w-auto ml-auto"
                />
              </div>
            </form>
          </div>

          <div className="w-full bg-white h-full p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Confirmation
              </h2>
              <p className="text-sm text-gray-400">Step 4 of 4</p>
            </div>
            <p className="text-base text-gray-300 -mt-4 mb-6">
              We are getting to the end. Just a few clicks and your rental is
              ready!
            </p>

            <form>
              <div className="space-y-4 mb-6">
                <div className="flex items-center p-4 bg-gray-100 rounded-lg">
                  <input
                    type="checkbox"
                    id="marketingConsent"
                    className="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="marketingConsent"
                    className="ml-3 text-base text-gray-800"
                  >
                    I agree with sending Marketing and newsletter emails. No
                    spam, promised!
                  </label>
                </div>
                <div className="flex items-center p-4 bg-gray-100 rounded-lg">
                  <input
                    type="checkbox"
                    id="termsConsent"
                    className="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="termsConsent"
                    className="ml-3 text-base text-gray-800"
                  >
                    I agree with our terms and conditions and privacy policy.
                  </label>
                </div>
              </div>

              <button className="p-4 px-7 bg-blue-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-600">
                Rent Now
              </button>
            </form>

            <div className="mt-8 flex items-center">
              <div className="flex flex-col items-start space-y-5">
                <img src="/images/shieldtick.svg" alt="" />
                <div>
                  <p className="text-base font-semibold text-gray-800 mb-2">
                    All your data are safe
                  </p>
                  <p className="text-sm text-gray-400">
                    We are using the most advanced security to provide you the
                    best experience ever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

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

            <div className="flex items-center mt-6">
              <div className="flex items-center relative w-20 h-20">
                <div
                  className="absolute inset-0 bg-cover bg-center rounded-lg"
                  style={{
                    backgroundImage: "url('/images/look.svg')",
                  }}
                ></div>

                <img
                  src={car.image}
                  alt="Car"
                  className="w-20 h-20 object-contain z-10 m-auto"
                />
              </div>

              <div className="ml-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {car.name}
                </h3>
                <div className="flex items-center justify-center mt-2">
                  <img src="/images/review-stars.svg" alt="" />
                  <p className="text-sm text-gray-600 ml-4">440+ Reviewer</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-8">
              <div className="flex justify-between text-base text-gray-400 mb-4">
                <p>Subtotal</p>
                <p className="text-black">${car.price}.00</p>
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
                  ${car.price}.00
                </p>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Overall price and includes rental discount
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RentForm;
