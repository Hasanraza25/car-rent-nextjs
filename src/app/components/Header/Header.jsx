"use client";
import { useState, useEffect, useRef } from "react";
import { useWishlist } from "@/app/Context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const { wishlistItems } = useWishlist();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const profileRef = useRef(null);
  const pathname = usePathname();

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const closeProfileDropdown = () => {
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        closeProfileDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  useEffect(() => {
    closeProfileDropdown();
  }, [pathname]);

  return (
    <header
      className={`md:py-6 py-3 bg-white border-b fixed w-full top-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-[1700px] px-5 md:px-10 flex items-center justify-between md:flex-row flex-col">
        <div className="w-full flex items-center justify-between md:hidden mb-4">
          <Link href="/">
            <div className="text-[#3563E9] text-4xl font-semibold">MORENT</div>
          </Link>
          <div className="relative" ref={profileRef}>
            <Image
              src="/images/profile.svg"
              alt="Profile Logo"
              width={50}
              height={50}
              className="rounded-full cursor-pointer"
              onClick={toggleProfileDropdown}
            />
            {isProfileOpen && (
              <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md p-5 z-50 w-[200px]">
                <ul className="space-y-4 text-lg">
                  <li>
                    <Link href="/profile">
                      <div className="block text-gray-700 hover:text-blue-500">
                        My Profile
                      </div>
                    </Link>
                  </li>
                  <li className="md:hidden">
                    <Link href="/settings">
                      <div className="block text-gray-700 hover:text-blue-500">
                        Settings
                      </div>
                    </Link>
                  </li>

                  <li className="md:hidden relative">
                    <Link href="/wishlist">
                      <div className="block text-gray-700 hover:text-blue-500">
                        Your Wishlists
                      </div>
                    </Link>
                    {wishlistItems?.length > 0 && (
                      <span className="absolute top-0 right-0 text-[10px] font-bold text-white bg-red-400 rounded-full w-4 h-4 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </li>
                  <li className="md:hidden relative">
                    <Link href="/notifications">
                      <div className="block text-gray-700 hover:text-blue-500">
                        Notifications
                      </div>
                    </Link>
                    <div className="absolute top-0 right-0 w-4 h-4 bg-red-400 rounded-full border border-white"></div>
                  </li>
                  <li>
                    <button
                      onClick={() => console.log("Logout clicked")}
                      className="block text-gray-700 hover:text-red-500 w-full text-left"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex items-center justify-between md:justify-start">
          <Link href="/">
            <div className="hidden md:block text-[#3563E9] text-4xl font-semibold">
              MORENT
            </div>
          </Link>

          <div className="header-searchbar relative w-full md:w-[300px] xl:w-[550px] ml-0 lg:ml-28 md:ml-7  flex flex-col md:flex-row items-center">
            <div className="absolute top-0 left-5 flex items-center h-full text-gray-500">
              <Image
                src="/images/search-icon.svg"
                alt="Search Logo"
                width={25}
                height={25}
              />
            </div>
            <input
              type="text"
              placeholder="Search something here"
              className="w-full h-12 pl-14 sm:text-sm pr-5 rounded-full bg-white text-[#596780] border focus:outline-none tracking-wider font-[400]"
            />
          </div>
        </div>

        <div className="hidden md:flex space-x-5 items-center">
          <Link href={"/wishlist"}>
            <div className="relative p-3 sm:w-[50px] border border-gray-300 rounded-full">
              <Image
                src="/images/heart.svg"
                alt="Heart Logo"
                width={50}
                height={50}
              />
              {wishlistItems?.length > 0 && (
                <span className="absolute top-0 right-0 text-[10px] font-bold text-white bg-red-400 rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </div>
          </Link>

          <div className="relative p-3 border sm:w-[70px] border-gray-300 rounded-full">
            <Image
              src="/images/notification.svg"
              alt="Notification Logo"
              width={40}
              height={40}
            />
            <div className="absolute top-0 right-0 w-4 h-4 bg-red-400 rounded-full border border-white"></div>
          </div>

          <div className="p-3 border border-gray-300 sm:w-[70px] rounded-full">
            <Image
              src="/images/setting.svg"
              alt="Settings Logo"
              width={40}
              height={40}
            />
          </div>

          <div className="relative" ref={profileRef}>
            <Image
              src="/images/profile.svg"
              alt="Profile Logo"
              width={75}
              height={75}
              className="rounded-full cursor-pointer"
              onClick={toggleProfileDropdown}
            />
            {isProfileOpen && (
              <div className="absolute right-0 top-16 bg-white shadow-lg rounded-md p-5 z-50 w-[220px]">
                <ul className="space-y-4 text-lg">
                  <li>
                    <Link href="/profile">
                      <div className="block text-gray-700 hover:text-blue-500">
                        My Profile
                      </div>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => console.log("Logout clicked")}
                      className="block text-gray-700 hover:text-red-500 w-full text-left"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );

};

export default Header;
