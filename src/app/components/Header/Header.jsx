"use client";
import { useState, useEffect, useRef } from "react";
import { useWishlist } from "@/app/Context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { client, urlFor } from "@/sanity/lib/client";
import { ClipLoader } from "react-spinners";
import { useClerk, useUser } from "@clerk/nextjs";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import {
  HeartIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const { wishlistItems } = useWishlist();
  const { user, isSignedIn } = useUser(); // Clerk Authentication
  const { signOut, openSignIn } = useClerk(); // Clerk Functions
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Search Functionality States
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const searchRef = useRef(null);

  const pathname = usePathname();

  useEffect(() => {
    if (isProfileOpen) {
      document.body.style.position = "fixed"; // Prevents scrolling
      document.body.style.width = "100%"; // Prevents horizontal shift
    } else {
      document.body.style.position = ""; // Restore scrolling
    }

    return () => {
      document.body.style.position = ""; // Cleanup on unmount
    };
  }, [isProfileOpen]);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const addToRecentSearches = (item) => {
    const newItem = {
      type: item.type,
      name: item.name,
      image: item.type === "car" ? item.image : item.lastCarImage,
      category: item.type === "car" ? item.category : item.name,
      slug: item.type === "car" ? item.currentSlug : item.categorySlug,
      categorySlug: item.categorySlug,
    };

    const newRecent = [
      newItem,
      ...recentSearches.filter(
        (search) =>
          !(search.name === newItem.name && search.type === newItem.type)
      ),
    ].slice(0, 3);

    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
  };

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

  const removeRecentSearch = (index) => {
    const newRecentSearches = [...recentSearches];
    newRecentSearches.splice(index, 1);
    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

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
      className={`md:py-6 py-3 bg-white border-b w-full z-50 transition-transform duration-300 
      }`}
    >
      <div className="mx-auto max-w-[1700px] px-5 md:px-10 flex items-center justify-between md:flex-row flex-col">
        <div className="w-full flex items-center justify-between md:hidden mb-4">
          <Link href="/">
            <div className="text-[#3563E9] text-4xl font-semibold">MORENT</div>
          </Link>
          <Menu as="div" className="relative">
            {/* Profile Button */}
            <MenuButton className="flex items-center focus:outline-none">
              <Image
                src="/images/profile.svg"
                alt="Profile"
                width={50}
                height={50}
                className="rounded-full cursor-pointer"
              />
            </MenuButton>

            {/* Dropdown Menu */}
            <MenuItems
              as="div"
              className="absolute right-0 mt-2 w-56 z-50 bg-white shadow-lg rounded-md py-2 ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {/* Wishlist */}
              <MenuItem as="div">
                <Link
                  href="/wishlist"
                  className={`flex items-center gap-2 px-4 py-2 cursor-pointer 
                ${pathname === "/wishlist" ? "text-blue-500" : "text-gray-700 hover:text-blue-500"}
              `}
                >
                  <HeartIcon className="w-5 h-5" />
                  Your Wishlists
                  {wishlistItems?.length > 0 && (
                    <span className="ml-auto text-[10px] font-bold text-white bg-red-400 rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
              </MenuItem>

              {/* Notifications */}
              <MenuItem as="div">
                <Link
                  href="/notifications"
                  className={`flex items-center gap-2 px-4 py-2 cursor-pointer 
                ${pathname === "/notifications" ? "text-blue-500" : "text-gray-700 hover:text-blue-500"}
              `}
                >
                  <BellIcon className="w-5 h-5" />
                  Notifications
                </Link>
              </MenuItem>

              {/* Sign In / Profile + Logout */}
              {!isSignedIn ? (
                <MenuItem as="div">
                  <button
                    onClick={() => openSignIn()}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-500 w-full text-left"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    Sign In
                  </button>
                </MenuItem>
              ) : (
                <>
                  {/* Profile */}
                  <MenuItem as="div">
                    <Link
                      href="/profile"
                      className={`flex items-center gap-2 px-4 py-2 cursor-pointer 
                    ${pathname === "/profile" ? "text-blue-500" : "text-gray-700 hover:text-blue-500"}
                  `}
                    >
                      <UserIcon className="w-5 h-5" />
                      My Profile
                    </Link>
                  </MenuItem>

                  {/* Settings (Only visible on mobile) */}
                  <MenuItem as="div">
                    <Link
                      href="/settings"
                      className={`flex items-center gap-2 px-4 py-2 md:hidden cursor-pointer 
                    ${pathname === "/settings" ? "text-blue-500" : "text-gray-700 hover:text-blue-500"}
                  `}
                    >
                      <Cog6ToothIcon className="w-5 h-5" />
                      Settings
                    </Link>
                  </MenuItem>

                  {/* Logout */}
                  <MenuItem as="div">
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-500 w-full text-left"
                    >
                      <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                      Logout
                    </button>
                  </MenuItem>
                </>
              )}
            </MenuItems>
          </Menu>
        </div>

        <div className="w-full flex items-center justify-between md:justify-start">
          <Link href="/">
            <div className="hidden md:block text-[#3563E9] text-4xl font-semibold">
              MORENT
            </div>
          </Link>

          <div
            className="relative w-full md:mx-10  flex flex-col"
            ref={searchRef}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for cars or categories..."
                className="w-full h-12 md:pl-14 pl-12 md:pr-14 pr-12 text-[12px] md:text-sm lg:text-base rounded-full bg-white border text-[#596780] focus:outline-none tracking-wider"
                value={searchQuery}
                onClick={handleInputClick}
                onChange={handleSearch}
              />

              {/* Search Icon (Left Side) */}
              <div className="absolute top-0 md:left-5 left-3 flex items-center h-full text-gray-500">
                <Image
                  src="/images/search-icon.svg"
                  alt="Search Icon"
                  width={25}
                  height={25}
                />
              </div>

              {/* Volume Icon (Right Side) */}
              <Link href={"/cars"}>
                <div className="absolute top-0 md:right-5 right-3 flex items-center h-full text-gray-500 cursor-pointer">
                  <Image
                    src="/images/volume-icon.svg"
                    alt="Volume Icon"
                    width={25}
                    height={25}
                  />
                </div>
              </Link>
            </div>

            {isDropdownOpen && (
              <ul
                className={`absolute top-14 w-full bg-white border rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto 
             scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500 
             transition-transform duration-300 ease-in-out transform ${
               isDropdownOpen
                 ? "opacity-100 translate-y-0 scale-100"
                 : "opacity-0 translate-y-[-20px] scale-95"
             }`}
              >
                {isLoading ? (
                  <li className="p-4 flex justify-center">
                    <ClipLoader size={30} color={"#3563E9"} />
                  </li>
                ) : searchQuery.trim() ? (
                  searchResults.length > 0 ? (
                    searchResults.map((item, index) => (
                      <li
                        key={index}
                        className="border-b last:border-none"
                        onMouseEnter={() => {
                          setLastSearchQuery(searchQuery); // Save the previous input value
                          setSearchQuery(item.name); // Show hovered item name
                        }}
                        onMouseLeave={() => {
                          setSearchQuery(lastSearchQuery); // Revert back to previous value when unhovered
                        }}
                      >
                        <Link
                          href={
                            item.type === "car"
                              ? `/cars/${item.categorySlug}/${item.currentSlug}`
                              : `/cars/${item.categorySlug}`
                          }
                          className="flex items-center p-3 hover:bg-gray-100"
                          onClick={() => {
                            setSearchQuery(item.name); // Set input value permanently
                            setIsDropdownOpen(false); // Close the dropdown
                            addToRecentSearches(item); // Add to recent searches
                          }}
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
                      No results found!
                    </li>
                  )
                ) : (
                  <>
                    {recentSearches.length > 0 && (
                      <>
                        <div className="p-3 text-base text-center flex justify-between">
                          <h3 className="text-base text-gray-500 font-semibold pt-2 ">
                            Recent Searches
                          </h3>
                          <button
                            className="text-gray-500 text-sm hover:text-[#F87171] font-semibold "
                            onClick={clearAllRecentSearches}
                          >
                            Clear All
                          </button>
                        </div>
                        {recentSearches.map((item, index) => (
                          <Link
                            href={
                              item.type === "car"
                                ? `/cars/${item.categorySlug}/${item.slug}`
                                : `/cars/${item.categorySlug}`
                            }
                            key={index}
                            className="flex items-center justify-between p-3 hover:bg-gray-100 border-b last:border-none"
                          >
                            <li
                              key={index}
                              className="flex items-center"
                              onClick={() => {
                                setSearchQuery(item.name);
                                setIsDropdownOpen(false);
                                addToRecentSearches(item);
                              }}
                            >
                              <Image
                                src={
                                  item.image
                                    ? urlFor(item.image).url()
                                    : "/images/cars/car-3.svg"
                                }
                                alt={item.name}
                                width={50}
                                height={50}
                                className="rounded-md object-cover"
                              />
                              <div className="ml-4">
                                <p className="text-lg font-semibold">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.type === "car"
                                    ? item.category
                                    : "Category"}
                                </p>
                              </div>

                              {/* Close Button */}
                            </li>
                            <button
                              className="ml-4 text-gray-500 hover:text-[#F87171]"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeRecentSearch(index);
                              }}
                            >
                              ✖
                            </button>
                          </Link>
                        ))}
                      </>
                    )}

                    <h3 className="text-base text-gray-500 font-semibold py-2 pl-3">
                      Categories
                    </h3>
                    {categories.map((cat) => (
                      <li
                        key={cat._id}
                        className=" last:border-none"
                        onClick={() => setSearchQuery(cat.name)}
                      >
                        <Link
                          href={`/cars/${cat.categorySlug}`}
                          className="flex items-center p-3 hover:bg-gray-100"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            addToRecentSearches({
                              ...cat,
                              type: "category",
                            });
                          }}
                        >
                          <Image
                            src={
                              cat.lastCarImage
                                ? urlFor(cat.lastCarImage).url()
                                : "/images/cars/car-3.svg"
                            }
                            alt={cat.name}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                          <div className="ml-4">
                            <p className="text-lg font-semibold">{cat.name}</p>
                            <p className="text-sm text-gray-500">Category</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </>
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

          <Menu as="div" className="relative">
            {/* Profile Button */}
            <MenuButton className="flex items-center focus:outline-none">
              <Image
                src="/images/profile.svg"
                alt="Profile"
                width={70}
                height={70}
                className="rounded-full"
              />
            </MenuButton>
            {/* Dropdown Menu */}
            <MenuItems className="absolute right-0 mt-2 w-48 z-50 bg-white shadow-lg rounded-md py-2 ring-1 ring-black ring-opacity-5 focus:outline-none">
              {isSignedIn ? (
                <>
                  {/* Profile */}
                  <MenuItem
                    as="div"
                    className={`flex items-center gap-2 px-4 py-2 cursor-pointer 
              ${pathname === "/profile" ? "text-blue-500 bg-gray-100" : "text-gray-700 hover:bg-gray-100"}
            `}
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 w-full"
                    >
                      <UserIcon className="w-5 h-5" />
                      My Profile
                    </Link>
                  </MenuItem>

                  {/* Logout */}
                  <MenuItem
                    as="div"
                    className="flex items-center gap-2 px-4 py-2 text-left w-full text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 w-full"
                    >
                      <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                      Logout
                    </button>
                  </MenuItem>
                </>
              ) : (
                <MenuItem
                  as="div"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <button
                    onClick={() => openSignIn()}
                    className="flex items-center gap-2 w-full"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    Sign In
                  </button>
                </MenuItem>
              )}
            </MenuItems>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;
