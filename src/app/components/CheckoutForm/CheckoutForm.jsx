"use client";
import React, { useState, useEffect } from "react";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useClerk, useUser } from "@clerk/nextjs";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const CheckoutForm = ({
  car,
  days,
  onSuccess,
  pickupDate: initialPickUpDate,
  dropoffDate: initialDropoffDate,
  onDropoffDateChange,
  setDays,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, isSignedIn } = useUser(); // Get User Auth Status
  const { openSignIn } = useClerk();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [isReadyToPay, setIsReadyToPay] = useState(false);
  const [cities, setCities] = useState([]);
  const [pickupCity, setPickupCity] = useState("");
  const [dropoffCity, setDropoffCity] = useState("");
  const [pickupDate, setPickupDate] = useState(initialPickUpDate);
  const [dropoffDate, setDropoffDate] = useState(initialDropoffDate);
  const [pickupTime, setPickupTime] = useState("10:00 AM");
  const [dropoffTime, setDropoffTime] = useState("10:00 AM");

  useEffect(() => {
    const fetchCities = async () => {
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

  useEffect(() => {
    const minDropoffDate = calculateMinDropoffDate(pickupDate, pickupTime);
    setDropoffDate(
      new Date(minDropoffDate.getTime() + (days - 1) * 24 * 60 * 60 * 1000)
    );
  }, [pickupDate, pickupTime, days]);

  const handlePickupDateChange = (date) => {
    setPickupDate(date);

    const minDropoffDate = calculateMinDropoffDate(date, pickupTime);

    // Ensure the dropoff date is updated properly
    const adjustedDropoffDate = new Date(
      minDropoffDate.getTime() + (days - 1) * 24 * 60 * 60 * 1000
    );

    setDropoffDate(adjustedDropoffDate);
  };

  const handlePickupTimeChange = (time) => {
    setPickupTime(time);
    const minDropoffDate = calculateMinDropoffDate(pickupDate, time);
    setDropoffDate(
      new Date(minDropoffDate.getTime() + days * 24 * 60 * 60 * 1000)
    );
  };

  const handleDropoffDateChange = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    if (isNaN(date.getTime())) {
      console.error("Invalid dropoff date:", date);
      return;
    }

    let minDropoffDate = calculateMinDropoffDate(pickupDate, pickupTime);
    let maxDropoffDate = new Date(pickupDate);
    maxDropoffDate.setDate(maxDropoffDate.getDate() + 10);

    // Ensure the selected date is within the valid range
    if (date < minDropoffDate) {
      date = minDropoffDate;
    } else if (date > maxDropoffDate) {
      date = maxDropoffDate;
    }

    // Calculate the number of days between pickupDate and dropoffDate
    const newDays = Math.max(
      1,
      Math.ceil((date - pickupDate) / (1000 * 60 * 60 * 24))
    );

    // Update days and dropoffDate
    setDays(newDays);
    setDropoffDate(date);
    onDropoffDateChange(date); // Notify parent component
  };

  const handleDropoffTimeChange = (time) => {
    setDropoffTime(time);
  };

  useEffect(() => {
    if (isSignedIn && isReadyToPay) {
      handleSubmit(); // Auto-trigger payment if user just signed in
    }
  }, [isSignedIn, isReadyToPay]);

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();

    // Check if required fields are filled
    if (
      !pickupCity ||
      pickupCity === "Select your city" ||
      !dropoffCity ||
      dropoffCity === "Select your city" ||
      !pickupDate ||
      !dropoffDate ||
      !pickupTime ||
      !dropoffTime
    ) {
      setError(
        "Please fill in all required fields (pickup and dropoff locations, dates, and times)."
      );
      return;
    }

    if (!isSignedIn) {
      setIsReadyToPay(true); // Set flag to continue payment after login
      openSignIn(); // Open Clerk Sign-In Modal
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Calculate total amount in cents
      const amount = car.price * days * 100;
      const userId = user.id;
      // Create a PaymentIntent
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          userId,
          carId: car._id,
          carName: car.name,
          pickupLocation: pickupCity,
          dropoffLocation: dropoffCity,
          pickupDate,
          dropoffDate,
          userName: name,
          userPhone: phone,
          userAddress: address,
          userCity: city,
        }),
      });

      const { paymentIntent, reservation } = await response.json();

      // Confirm the payment
      const { error: stripeError, paymentIntent: confirmedIntent } =
        await stripe.confirmCardPayment(paymentIntent.client_secret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: name,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
      } else {
        // ✅ Call API to update stock after successful payment
        const updateStockResponse = await fetch("/api/update-stock", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ carId: car._id }),
        });

        const updateStockData = await updateStockResponse.json();

        console.log("Stock Update Response:", updateStockData);

        if (updateStockData.success) {
          onSuccess(reservation);
        } else {
          setError(
            `Stock update failed: ${updateStockData.error || "Unknown error"} ${car._id}`
          );
        }
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
      console.error("Error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="order-2 lg:order-1 w-full lg:w-2/3 flex flex-col space-y-6 lg:space-y-10">
      <form onSubmit={handleSubmit}>
        {/* Billing Info */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Billing Info
            </h2>
            <p className="text-sm text-gray-400">Step 1 of 4</p>
          </div>
          <p className="text-base text-gray-300 -mt-4 mb-6">
            Please enter your billing info
          </p>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-4 block w-full p-5 pl-7 rounded-md bg-gray-100 text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-4 block w-full p-5 pl-7 rounded-md bg-gray-100 text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-4 block w-full p-5 pl-7 rounded-md bg-gray-100 text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-4 block w-full p-5 pl-7 rounded-md bg-gray-100 text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Rental Info */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Rental Info</h2>
            <p className="text-sm text-gray-400">Step 2 of 4</p>
          </div>
          <p className="text-base text-gray-300 -mt-4 mb-6">
            Please select your rental date
          </p>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="pickup"
                name="rental"
                className="w-4 h-4 rounded-full border-2 border-gray-300 appearance-none checked:bg-blue-500 checked:ring-2 checked:ring-blue-500 focus:outline-none"
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
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                  >
                    <option>Select your city</option>
                    {cities.map((city, index) => (
                      <option
                        key={index}
                        value={city}
                        className="text-gray-600"
                      >
                        {city}
                      </option>
                    ))}
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
                  <Flatpickr
                    options={{
                      enableTime: false, // Only date selection
                      dateFormat: "Y-m-d", // Format: YYYY-MM-DD
                      minDate: new Date().fp_incr(1), // Prevent selecting today's date
                      clickOpens: true, // Open only when clicked
                      disableMobile: true,
                    }}
                    className="block w-full p-5 pl-7 pr-10 rounded-md bg-gray-100 text-gray-500 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none"
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27gray%27%3E%3Cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3E%3C/svg%3E")',
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.5em",
                    }}
                    placeholder="Select your Date"
                    value={pickupDate}
                    onChange={handlePickupDateChange}
                  />
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
                  <Flatpickr
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: "h:i K", // 12-hour format with AM/PM
                      time_24hr: false,
                      minuteIncrement: 5,
                      disableMobile: true,
                    }}
                    id="pickup-time"
                    className="block w-full p-5 pl-7 pr-10 rounded-md bg-gray-100 text-gray-500 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none"
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27gray%27%3E%3Cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3E%3C/svg%3E")',
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.5em",
                    }}
                    value={pickupTime}
                    onChange={(selectedDates) =>
                      handlePickupTimeChange(
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
          </div>

          <div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="dropoff"
                name="rental"
                className="w-4 h-4 rounded-full border-2 border-gray-300 appearance-none checked:bg-blue-500 checked:ring-2 checked:ring-blue-500 focus:outline-none"
                defaultChecked
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
                    value={dropoffCity}
                    onChange={(e) => setDropoffCity(e.target.value)}
                  >
                    <option>Select your city</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
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
                  <Flatpickr
                    options={{
                      enableTime: false, // Only date selection
                      dateFormat: "Y-m-d", // Format: YYYY-MM-DD
                      minDate: calculateMinDropoffDate(pickupDate, pickupTime), // Prevent past dates
                      clickOpens: true, // Open only when clicked
                      disableMobile: true,
                    }}
                    id="dropoff-date"
                    className="block w-full p-5 pl-7 pr-10 rounded-md bg-gray-100 text-gray-500 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none"
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27gray%27%3E%3Cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3E%3C/svg%3E")',
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.5em",
                    }}
                    placeholder="Select your Date"
                    value={dropoffDate}
                    onChange={handleDropoffDateChange}
                  />
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
                  <Flatpickr
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: "h:i K", // 12-hour format with AM/PM
                      time_24hr: false,
                      minuteIncrement: 5, // Adjust for smooth scrolling
                      disableMobile: true,
                    }}
                    id="dropoff-time"
                    className="block w-full p-5 pl-7 pr-10 rounded-md bg-gray-100 text-gray-500 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none"
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27gray%27%3E%3Cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3E%3C/svg%3E")',
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.5em",
                    }}
                    onChange={handleDropoffTimeChange}
                    value={dropoffTime}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Payment Method
            </h2>
            <p className="text-sm text-gray-400">Step 3 of 4</p>
          </div>
          <p className="text-base text-gray-300 -mt-4 mb-6">
            Please enter your payment method
          </p>
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
                <div className="mt-4">
                  <CardNumberElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                    className="block w-full p-5 rounded-md bg-white text-gray-600 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="expirationDate"
                  className="block text-base font-medium text-black"
                >
                  Expiration Date
                </label>
                <div className="mt-4">
                  <CardExpiryElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                    className="block w-full p-5 rounded-md bg-white text-gray-600 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
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
                <div className="mt-4">
                  <CardCvcElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                    className="block w-full p-5 rounded-md bg-white text-gray-600 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md mt-6">
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
                I agree with sending Marketing and newsletter emails. No spam,
                promised!
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
          <button
            type="submit"
            disabled={!stripe || loading}
            className="animated-button p-4 px-7 text-white py-4 rounded-lg text-lg font-semibold"
          >
            {loading ? "Processing..." : "Rent Now"}
          </button>
        </div>

        {error && <div className="text-red-500 mt-4">{error}</div>}
      </form>
    </div>
  );
};

export default CheckoutForm;
