"use client";
import React, { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import {
  FaCar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaCarSide,
  FaHourglassHalf,
  FaFlagCheckered,
} from "react-icons/fa";
import {
  ArrowLeftOnRectangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const ReservationDashboard = () => {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      if (isSignedIn && user) {
        try {
          const response = await axios.get(`/api/reservations/user/${user.id}`);
          setReservations(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReservations();
  }, [isSignedIn, user]); // <- Depend on user.id for re-fetching

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!isSignedIn)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-center animate-fadeInSlideUp">
        {/* Bouncing Lock Icon */}
        <div className="animate-bounce">
          <LockClosedIcon className="w-24 h-24 text-gray-900 bg-gray-200 p-5 rounded-full shadow-lg" />
        </div>

        <h1
          className="text-4xl font-extrabold mt-5 opacity-0 animate-fadeIn text-gray-900"
          style={{ animationDelay: "300ms" }}
        >
          Access Denied
        </h1>

        <p
          className="text-lg text-gray-600 mt-3 max-w-lg px-6 opacity-0 animate-fadeIn"
          style={{ animationDelay: "500ms" }}
        >
          Oops! You need to be signed in to view reservations. Please log in to
          access your account.
        </p>

        <button
          onClick={openSignIn}
          className="mt-8 px-6 py-3 bg-[#db4444] hover:bg-[#fa4545] text-white font-semibold text-lg rounded-full flex items-center gap-2 shadow-lg transition-transform transform hover:scale-105 duration-300 opacity-0 animate-fadeIn"
          style={{ animationDelay: "900ms" }}
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          Sign In Now
        </button>
      </div>
    );

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 h-screen my-10">
      <div className="flex flex-wrap justify-center items-center my-10">
        <FaClipboardList className="text-4xl mobile:text-xl text-blue-500 mr-3" />
        <h1 className="text-5xl font-bold text-center mobile:text-xl">
          Reservation Dashboard
        </h1>
      </div>
      {reservations.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 text-lg">No reservations found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaCarSide className="text-base text-blue-500 mr-2" />
                    Car Name
                  </div>
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaCar className="text-base text-blue-500 mr-2" />
                    Car ID
                  </div>
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-base text-green-500 mr-2" />
                    Pick-Up Location
                  </div>
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-base text-red-500 mr-2" />
                    Drop-Off Location
                  </div>
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-base text-yellow-500 mr-2" />
                    Pick-Up Date
                  </div>
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-base text-purple-500 mr-2" />
                    Drop-Off Date
                  </div>
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaCheckCircle className="text-base mr-2 text-green-500" />
                    Status
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCarSide className="text-xl text-blue-500 mr-2" />
                      <span className="text-gray-900">
                        {reservation.carName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <Link href={`/reservations/${reservation._id}`}>
                        <span className="text-blue-500 underline hover:text-blue-700">
                          {reservation.carId}
                        </span>
                      </Link>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {reservation.pickupLocation}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {reservation.dropoffLocation}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {new Date(reservation.pickupDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {new Date(reservation.dropoffDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        {reservation.status === "confirmed" && (
                          <>
                            <FaCheckCircle className="text-lg text-green-500 mr-2" />
                            <span className="text-gray-900">Confirmed</span>
                          </>
                        )}
                        {reservation.status === "in_progress" && (
                          <>
                            <FaHourglassHalf className="text-lg text-blue-500 mr-2" />
                            <span className="text-gray-900">In Progress</span>
                          </>
                        )}
                        {reservation.status === "completed" && (
                          <>
                            <FaFlagCheckered className="text-lg text-purple-500 mr-2" />
                            <span className="text-gray-900">Completed</span>
                          </>
                        )}
                      </div>
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReservationDashboard;
