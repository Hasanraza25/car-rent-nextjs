"use client";
import { useState, useEffect, useRef } from "react";
import { useWishlist } from "@/app/Context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { client, urlFor } from "@/sanity/lib/client";
import { ClipLoader } from "react-spinners";

const Header = () => {
  const { wishlistItems } = useWishlist();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Search Functionality States
  const [cars, setCars] = useState([]); // Stores all fetched cars
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchRef = useRef(null);

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

  // Search Functionality useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const categoriesQuery = `*[_type == 'categories']{
          name,
          "categorySlug": slug.current,
          "lastCarImage": *[_type == 'car' && references(^._id)] | order(_createdAt desc)[0].image
        }`;
        const fetchedCategories = await client.fetch(categoriesQuery);

        const carsQuery = `*[_type == 'car'] | order(_createdAt desc){
          name,
          "category": type->name,
          price,
          stock,
          image,
          discount,
          "categorySlug": type->slug.current,
          "currentSlug": slug.current
        }`;
        const fetchedCars = await client.fetch(carsQuery);

        setCategories(fetchedCategories);
        setCars(fetchedCars);
        setIsLoading(false); // Stop loading after fetching
        setSearchResults(
          fetchedCategories.map((cat) => ({ ...cat, type: "category" }))
        );
      } catch (err) {
        console.error("Error fetching data:", err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const matchFirstLetterOfWords = (query, text) => {
    const words = text.toLowerCase().split(" ");
    return words.some((word) => word.startsWith(query.toLowerCase()));
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults(categories.map((cat) => ({ ...cat, type: "category" }))); // Show all categories when empty
      setIsDropdownOpen(true);
      return;
    }

    // Filter cars (match first letter of any word)
    const filteredCars = cars.filter((car) =>
      matchFirstLetterOfWords(query, car.name)
    );

    // Filter categories (match first letter of any word)
    const filteredCategories = categories.filter((cat) =>
      matchFirstLetterOfWords(query, cat.name)
    );

    // Prioritize cars first, then categories
    const results = [
      ...filteredCars.map((car) => ({ ...car, type: "car" })),
      ...filteredCategories.map((cat) => ({ ...cat, type: "category" })),
    ];

    setSearchResults(results);
    setIsDropdownOpen(true);
  };

  const handleInputClick = () => {
    setIsDropdownOpen(true); // Always open dropdown immediately
    if (isLoading) return; // If still loading, don't change results
    setSearchResults(categories.map((cat) => ({ ...cat, type: "category" })));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

          <div
            className="relative w-full md:w-[300px] xl:w-[550px] ml-5 flex flex-col"
            ref={searchRef}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for cars or categories..."
                className="w-full h-12 pl-14 pr-5 rounded-full bg-white border text-[#596780] focus:outline-none tracking-wider"
                value={searchQuery}
                onClick={handleInputClick}
                onChange={handleSearch}
              />

              <div className="absolute top-0 left-5 flex items-center h-full text-gray-500">
                <Image
                  src="/images/search-icon.svg"
                  alt="Search Icon"
                  width={25}
                  height={25}
                />
              </div>
            </div>

            {isDropdownOpen && (
              <ul className="absolute top-14 w-full bg-white border rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
                {/* Show Loader if Data is Loading */}
                {isLoading ? (
                  <li className="p-4 flex justify-center">
                    <ClipLoader size={30} color={"#3563E9"} />
                  </li>
                ) : searchResults.length > 0 ? (
                  searchResults.map((item, index) => (
                    <li key={index} className="border-b last:border-none">
                      <Link
                        href={
                          item.type === "car"
                            ? `/cars/${item.categorySlug}/${item.currentSlug}`
                            : `/cars/${item.categorySlug}`
                        }
                        className="flex items-center p-3 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {/* Image */}
                        <Image
                          src={
                            item.type === "car"
                              ? urlFor(item.image).url()
                              : item.lastCarImage
                                ? urlFor(item.lastCarImage).url()
                                : "/images/cars/car-3.svg"
                          }
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />

                        {/* Text Content */}
                        <div className="ml-4">
                          <p className="text-lg font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.type === "car" ? item.category : "Category"}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="p-4 text-gray-500 text-center">
                    No results found
                  </li>
                )}
              </ul>
            )}
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
