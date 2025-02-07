"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaCar, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ReservationDashboard = () => {
  const { user, isSignedIn } = useUser();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      if (isSignedIn) {
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
  }, [isSignedIn, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={150} color={"#123abc"} loading={loading} />
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Reservation Dashboard</h1>
      {reservations.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 text-lg">No reservations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <FaCar className="text-2xl text-blue-500" />
                <span className="text-xl font-semibold">{reservation.carId}</span>
              </div>
              <div className="flex items-center space-x-4 mb-2">
                <FaMapMarkerAlt className="text-lg text-green-500" />
                <span className="text-gray-700">Pick-Up Location: {reservation.pickupLocation}</span>
              </div>
              <div className="flex items-center space-x-4 mb-2">
                <FaMapMarkerAlt className="text-lg text-red-500" />
                <span className="text-gray-700">Drop-Off Location: {reservation.dropoffLocation}</span>
              </div>
              <div className="flex items-center space-x-4 mb-2">
                <FaCalendarAlt className="text-lg text-yellow-500" />
                <span className="text-gray-700">Pick-Up Date: {new Date(reservation.pickupDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-4 mb-2">
                <FaCalendarAlt className="text-lg text-purple-500" />
                <span className="text-gray-700">Drop-Off Date: {new Date(reservation.dropoffDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-4">
                {reservation.status === "confirmed" ? (
                  <FaCheckCircle className="text-lg text-green-500" />
                ) : (
                  <FaTimesCircle className="text-lg text-red-500" />
                )}
                <span className="text-gray-700">{reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationDashboard;