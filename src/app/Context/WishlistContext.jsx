"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify"; // ✅ Import React-Toastify
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify CSS

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedWishlistItems = localStorage.getItem("wishlistItems");
    if (storedWishlistItems) {
      setWishlistItems(JSON.parse(storedWishlistItems));
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && isHydrated) {
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isHydrated]);

  const addToWishlist = (item) => {
    setWishlistItems((prevItems) => {
      const isItemInWishlist = prevItems.some(
        (wishlistItem) => wishlistItem.currentSlug === item.currentSlug
      );

      if (!isItemInWishlist) {
        toast.success("Added to Wishlist!", {
          toastId: "wishlist-toast", // ✅ Ensures only one toast appears
          position: "top-right",
          autoClose: 2000, // ✅ Ensures toast stays for 2 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        return [item, ...prevItems];
      }

      return prevItems;
    });
  };

  const removeFromWishlist = (slug) => {
    setWishlistItems((prevItems) => {
      const updatedWishlist = prevItems.filter(
        (item) => item.currentSlug !== slug
      );

      if (updatedWishlist.length !== prevItems.length) {
        toast.error("Removed from Wishlist!", {
          toastId: "wishlist-toast", // ✅ Ensures only one toast appears
          position: "top-right",
          autoClose: 2000, // ✅ Ensures toast stays for 2 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      return updatedWishlist;
    });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
