"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaCar,
  FaUsers,
  FaStar,
  FaShoppingCart,
  FaHome,
  FaCog,
  FaMoneyBillWave,
  FaHeadset,
  FaChartLine,
  FaTags,
} from "react-icons/fa";
import { MdMenu, MdClose } from "react-icons/md";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();

  return (
    <>
      {/* Sidebar for Large Screens (Always Visible) */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 bg-gray-900 text-white w-64 shadow-lg transition-all`}
      >
        <div className="p-4 flex justify-between items-center">
          <button onClick={toggleSidebar} className="p-2 md:hidden">
            <MdClose size={24} />
          </button>
        </div>
        <nav className="flex flex-col space-y-2 p-4">
          {[
            { icon: <FaHome />, label: "Dashboard", path: "/admin/dashboard" },
            { icon: <FaCar />, label: "Cars", path: "/admin/cars" },
            { icon: <FaChartLine />, label: "Rentals", path: "/admin/rentals" },
            { icon: <FaUsers />, label: "Users", path: "/admin/users" },
            { icon: <FaMoneyBillWave />, label: "Transactions", path: "/admin/transactions" },
            { icon: <FaStar />, label: "Reviews", path: "/admin/reviews" },
            { icon: <FaHeadset />, label: "Support", path: "/admin/support" },
            { icon: <FaShoppingCart />, label: "Buy/Sell", path: "/admin/buysell" },
            { icon: <FaTags />, label: "Promotions", path: "/admin/promotions" },
            { icon: <FaCog />, label: "Settings", path: "/admin/settings" },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded transition-all"
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar (Hidden by Default) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={toggleSidebar}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 bg-gray-900 text-white w-64 shadow-lg z-50 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="p-4 flex justify-between items-center">
          <button onClick={toggleSidebar} className="p-2">
            <MdClose size={24} />
          </button>
        </div>
        <nav className="flex flex-col space-y-2 p-4">
          {[
            { icon: <FaHome />, label: "Dashboard", path: "/admin/dashboard" },
            { icon: <FaCar />, label: "Cars", path: "/admin/cars" },
            { icon: <FaChartLine />, label: "Rentals", path: "/admin/rentals" },
            { icon: <FaUsers />, label: "Users", path: "/admin/users" },
            { icon: <FaMoneyBillWave />, label: "Transactions", path: "/admin/transactions" },
            { icon: <FaStar />, label: "Reviews", path: "/admin/reviews" },
            { icon: <FaHeadset />, label: "Support", path: "/admin/support" },
            { icon: <FaShoppingCart />, label: "Buy/Sell", path: "/admin/buysell" },
            { icon: <FaTags />, label: "Promotions", path: "/admin/promotions" },
            { icon: <FaCog />, label: "Settings", path: "/admin/settings" },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => {
                router.push(item.path);
                toggleSidebar(); // Close sidebar on navigation
              }}
              className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded transition-all"
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
