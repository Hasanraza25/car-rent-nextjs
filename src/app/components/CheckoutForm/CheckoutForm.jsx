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
  onPickupDateChange,
  pickupTime,
  onPickupTimeChange,
  maxDropoffDate,
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
  const pickupDate = initialPickUpDate;
  const dropoffDate = initialDropoffDate;
  const [dropoffTime, setDropoffTime] = useState("10:00 AM");
  const [isLoadingCities, setIsLoadingCities] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        const response = await fetch("/api/fetchCities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setCities(data.locations);
        } else {
          console.error("Error fetching cities:", data.error);
        }
      } catch (err) {
        setError("Erro Fetching Cities", err);
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  const calculateMinDropoffDate = (pickupDate) => {
    const minDropoffDate = new Date(pickupDate);
    minDropoffDate.setDate(minDropoffDate.getDate() + 1);
    return minDropoffDate;
  };

  useEffect(() => {
    const minDropoff = calculateMinDropoffDate(pickupDate);
    if (dropoffDate < minDropoff) {
      onDropoffDateChange(minDropoff);
    }
  }, [pickupDate]);

  const handlePickupDateChange = (date) => {
    onPickupDateChange(date[0]); // Assuming Flatpickr returns array
  };

  const handleDropoffDateChange = (date) => {
    onDropoffDateChange(date[0]);
  };

  useEffect(() => {
    const minDropoff = calculateMinDropoffDate(pickupDate, pickupTime);
    if (dropoffDate < minDropoff) {
      onDropoffDateChange(minDropoff);
    }
  }, [pickupDate, pickupTime]);

  const handleCityChange = (setter) => (e) => {
    const value = e.target.value;
    if (value !== "Loading cities..." && value !== "Select your city") {
      setter(JSON.parse(value));
    }
  };

  // In handlePickupTimeChange
  const handlePickupTimeChange = (selectedDates) => {
    if (selectedDates.length > 0 && selectedDates[0] instanceof Date) {
      const hours = selectedDates[0].getHours().toString().padStart(2, "0");
      const minutes = selectedDates[0].getMinutes().toString().padStart(2, "0");
      onPickupTimeChange(`${hours}:${minutes}`);
    }
  };

  // In handleDropoffTimeChange
  const handleDropoffTimeChange = (selectedDates) => {
    if (selectedDates.length > 0 && selectedDates[0] instanceof Date) {
      const hours = selectedDates[0].getHours().toString().padStart(2, "0");
      const minutes = selectedDates[0].getMinutes().toString().padStart(2, "0");
      setDropoffTime(`${hours}:${minutes}`);
    }
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
      pickupCity === "Loading cities..." ||
      !dropoffCity ||
      dropoffCity === "Select your city" ||
      dropoffCity === "Loading cities..." ||
      !pickupDate ||
      !dropoffDate
    ) {
      setError(
        "Please fill in all required fields (pickup and dropoff locations, dates)."
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
      const userEmail = user.primaryEmailAddress?.emailAddress;

      // Format the pickup and dropoff dates and times
      const formattedPickupDate = new Date(pickupDate)
        .toISOString()
        .split("T")[0];
      const formattedDropoffDate = new Date(dropoffDate)
        .toISOString()
        .split("T")[0];
      const formattedPickupTime = pickupTime; // Assuming pickupTime is already in the correct format
      const formattedDropoffTime = dropoffTime; // Assuming dropoffTime is already in the correct format

      // Create a PaymentIntent
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
        }),
      });

      const data = await response.json();

      if (!data.clientSecret) {
        console.error("Error: Missing client_secret in API response", data);
        setError("Payment failed: Missing payment secret from server.");
        setLoading(false);
        return;
      }

      const { clientSecret } = data;

      // Confirm the payment
      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          // Use client_secret directly
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: name,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
      } else {
        const reservationResponse = await fetch(
          "/api/reservations/create-reservation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              carId: car._id,
              carName: car.name,
              pickupCity: pickupCity.city,
              pickupLocation: pickupCity.address,
              dropOffCity: dropoffCity.city,
              dropoffLocation: dropoffCity.address,
              pickupDate: formattedPickupDate,
              pickupTime: formattedPickupTime,
              dropoffDate: formattedDropoffDate,
              dropoffTime: formattedDropoffTime,
              days,
              userName: name,
              userPhone: phone,
              userAddress: address,
              userCity: city,
              userEmail: userEmail,
            }),
          }
        );

        const reservationData = await reservationResponse.json();

        if (reservationData.error) {
          setError(`Reservation failed: ${reservationData.error}`);
          setLoading(false);
          return;
        }

        onSuccess(reservationData.reservation);

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
                    value={pickupCity ? JSON.stringify(pickupCity) : ""}
                    onChange={handleCityChange(setPickupCity)}
                  >
                    {isLoadingCities ? (
                      <option>Loading cities...</option>
                    ) : (
                      <>
                        <option value="">Select your city</option>
                        {cities.map((city, index) => (
                          <option key={index} value={JSON.stringify(city)}>
                            {city.city}
                          </option>
                        ))}
                      </>
                    )}
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
                      dateFormat: "H:i", // 24-hour format
                      time_24hr: true,
                      noCalendar: true,
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
                    onChange={handlePickupTimeChange}
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
                    value={dropoffCity ? JSON.stringify(dropoffCity) : ""}
                    onChange={handleCityChange(setDropoffCity)}
                  >
                    {isLoadingCities ? (
                      <option>Loading cities...</option>
                    ) : (
                      <>
                        <option value="">Select your city</option>
                        {cities.map((city, index) => (
                          <option key={index} value={JSON.stringify(city)}>
                            {city.city}
                          </option>
                        ))}
                      </>
                    )}
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
                      defaultDate: dropoffDate,
                      maxDate: maxDropoffDate,
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
                      dateFormat: "H:i", // 24-hour format
                      time_24hr: true,
                      noCalendar: true,
                      time_24hr: false,
                      minuteIncrement: 5,
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
