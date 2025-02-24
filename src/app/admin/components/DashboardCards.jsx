"use client";
import {
  FaCar,
  FaUsers,
  FaMoneyBillWave,
  FaClipboardList,
} from "react-icons/fa";

const DashboardCards = () => {
  const stats = [
    {
      title: "Total Cars",
      value: "120",
      icon: <FaCar />,
      color: "bg-blue-500",
    },
    {
      title: "Total Users",
      value: "5,200",
      icon: <FaUsers />,
      color: "bg-green-500",
    },
    {
      title: "Total Revenue",
      value: "$50,000",
      icon: <FaMoneyBillWave />,
      color: "bg-yellow-500",
    },
    {
      title: "Total Bookings",
      value: "3,450",
      icon: <FaClipboardList />,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-4 text-white rounded-lg shadow-md ${stat.color}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">{stat.icon}</span>
            <h2 className="text-lg">{stat.title}</h2>
          </div>
          <p className="text-3xl font-bold mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
