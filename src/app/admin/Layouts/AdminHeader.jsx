"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { FaMoon, FaSun, FaBell, FaUser } from "react-icons/fa";
import { MdMenu } from "react-icons/md";

const AdminHeader = ({ toggleSidebar }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="relative flex items-center justify-between p-4 bg-gray-900 text-white shadow-md w-full overflow-visible">
      {/* Mobile Sidebar Toggle */}
      <button className="md:hidden" onClick={toggleSidebar}>
        <MdMenu size={24} />
      </button>

      {/* Title */}
      <h1 className="text-xl font-bold truncate">Admin Panel</h1>

      {/* Right Section */}
      <div className="flex items-center space-x-4 relative">
        {/* Dark Mode Toggle */}
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2">
          {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon />}
        </button>

        {/* Notifications */}
        <button className="relative p-2">
          <FaBell />
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 flex items-center space-x-2 focus:outline-none"
          >
            <FaUser />
          </button>

          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg py-2 z-[1000]"
              style={{ top: "100%", position: "absolute" }}
            >
              <button
                onClick={() => router.push("/admin/profile")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Profile
              </button>
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
