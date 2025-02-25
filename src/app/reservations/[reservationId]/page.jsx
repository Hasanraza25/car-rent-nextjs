"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { urlFor } from "@/sanity/lib/client";
import Image from "next/image";
import {
  FaCar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaPhone,
  FaHome,
  FaCity,
  FaHourglassHalf,
  FaFlagCheckered,
} from "react-icons/fa";
import Swal from "sweetalert2";

const ReservationDetail = ({ params }) => {
  const { reservationId } = params;
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchReservation = async () => {
      if (reservationId) {
        try {
          const response = await axios.get(
            `/api/reservations/${reservationId}`
          );
          setReservation(response.data);
          setStatus(response.data.status);
        } catch (err) {
          if (err.response && err.response.status === 401) {
            setError(
              "You are not signed in or the reservation ID is incorrect."
            );
          } else {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReservation();
  }, [reservationId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.patch(`/api/reservations/${reservationId}/status`, {
        status: newStatus,
      });
      setStatus(newStatus);
    } catch (err) {
      console.error("Error updating status:", err.message);
    }
  };

  const handleCancelReservation = async () => {
    const { value: reason } = await Swal.fire({
      title: "Cancel Reservation",
      input: "select",
      inputOptions: {
        "Change of plans": "Change of plans",
        "Found a better deal": "Found a better deal",
        "Booking mistake": "Booking mistake",
        "Trip canceled": "Trip canceled",
        "Car not needed anymore": "Car not needed anymore",
        "Unable to travel": "Unable to travel",
        "Issue with the car": "Issue with the car",
        "COVID-19 concerns": "COVID-19 concerns",
        "Weather conditions": "Weather conditions",
        "Personal reasons": "Personal reasons",
        Other: "Other",
      },
      inputPlaceholder: "Select a reason",
      showCancelButton: true,
      cancelButtonText: "Close",
    });

    if (reason == "Other") {
      const { value: otherReason } = await Swal.fire({
        title: "Cancel Reservation",
        input: "text",
        inputPlaceholder: "Enter your reason",
        showCancelButton: true,
        cancelButtonText: "Close",
      });

      if (otherReason) {
        await cancelReservation(otherReason);
      }
    } else if (reason) {
      await cancelReservation(reason);
    }
  };

  const cancelReservation = async (reason) => {
    try {
      await axios.patch(`/api/reservations/${reservationId}/status`, {
        status: "canceled",
      });

      await axios.post(`/api/update-stock`, {
        carId: reservation.carId,
        increment: true,
      });

      setStatus("canceled");
      Swal.fire("Canceled", "Your reservation has been canceled.", "success");
    } catch (err) {
      console.error("Error canceling reservation: ", err);
      Swal.fire(
        "Error",
        "An error occurred while canceling your reservation.",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <p>Reservation not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      {/* Page Header */}
      <div className="flex flex-wrap md:justify-between justify-center gap-7 items-center my-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Reservation Details
        </h1>
        <div className="p-3 px-6 text-lg bg-blue-500 text-white rounded-lg shadow-md">
          #{reservationId}
        </div>
      </div>

      {/* Card Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Car Details */}
        <div className="lg:col-span-2 bg-white shadow-xl rounded-xl overflow-hidden">
          <div
            className="relative w-[90%] mx-auto my-5 z-10 py-10 bg-cover bg-center rounded-lg"
            style={{
              backgroundImage: "url('/images/hero-arrows.svg')",
            }}
          >
            <Image
              src={urlFor(reservation.car.image).url()}
              alt={reservation.carName}
              className="mx-auto mt-6 sm:mt-4 w-full max-w-[300px] rounded-lg"
              width={300} // Define a fixed width or use dynamic width depending on your layout
              height={200} // Define a fixed height or use dynamic height
              layout="responsive" // Ensures the image is responsive
              priority
            />
          </div>

          <div className="p-6">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              {reservation.car.name}
            </h2>
            <div className="grid grid-cols-2 gap-6 text-lg text-gray-700">
              <div>
                <p className="font-semibold">Type:</p>
                <p>{reservation.car.category}</p>
              </div>
              <div>
                <p className="font-semibold">Price:</p>
                <p>${reservation.car.price}/day</p>
              </div>
              <div>
                <p className="font-semibold">Fuel Capacity:</p>
                <p>{reservation.car.fuelCapacity} liters</p>
              </div>
              <div>
                <p className="font-semibold">Seats:</p>
                <p>{reservation.car.seatingCapacity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Info */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Trip Details
          </h3>
          <div className="space-y-4 text-gray-700 text-lg">
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-green-500 mr-3" />
              <span className="font-semibold">Pickup Location:</span>
              <span className="ml-2">{reservation.pickupLocation}</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-3" />
              <span className="font-semibold">Dropoff Location:</span>
              <span className="ml-2">{reservation.dropoffLocation}</span>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-yellow-500 mr-3" />
              <span className="font-semibold">Pickup Date:</span>
              <span className="ml-2">
                {new Date(reservation.pickupDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-purple-500 mr-3" />
              <span className="font-semibold">Dropoff Date:</span>
              <span className="ml-2">
                {new Date(reservation.dropoffDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-blue-500 mr-3" />
              <span className="font-semibold">Number of Days:</span>
              <span className="ml-2">{reservation.days}</span>
            </div>
          </div>

          {/* Status Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Status</h3>
            <div className="flex items-center mt-3">
              <div className="flex items-center gap-2">
                {status === "confirmed" && (
                  <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                    <FaCheckCircle className="mr-2" />
                    <span>Confirmed</span>
                  </div>
                )}
                {status === "in_progress" && (
                  <div className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
                    <FaHourglassHalf className="mr-2" />
                    <span>In Progress</span>
                  </div>
                )}
                {status === "canceled" && (
                  <div className="flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                    <FaTimesCircle className="mr-2" />
                    <span>Canceled</span>
                  </div>
                )}
                {status === "completed" && (
                  <div className="flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-lg">
                    <FaFlagCheckered className="mr-2" />
                    <span>Completed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* User Details */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">User Info</h3>
            <div className="mt-3 space-y-3 text-lg text-gray-700">
              <div className="flex items-center">
                <FaUser className="text-blue-500 mr-3" />
                <span className="font-semibold">Name:</span>
                <span className="ml-2">{reservation.userName}</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-green-500 mr-3" />
                <span className="font-semibold">Phone:</span>
                <span className="ml-2">{reservation.userPhone}</span>
              </div>
              <div className="flex items-center">
                <FaHome className="text-yellow-500 mr-3" />
                <span className="font-semibold">Address:</span>
                <span className="ml-2">{reservation.userAddress}</span>
              </div>
              <div className="flex items-center">
                <FaCity className="text-purple-500 mr-3" />
                <span className="font-semibold">City:</span>
                <span className="ml-2">{reservation.userCity}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleCancelReservation}
              className={`w-full text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200 ${status === "canceled" ? "bg-red-600" : " bg-red-500"}`}
              disabled={status === "canceled"}
            >
              {status === "canceled"
                ? "Reservation Canceled"
                : "Cancel Reservation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetail;
