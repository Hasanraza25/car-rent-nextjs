"use client";
const { createContext, useContext, useEffect, useState } = require("react");

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
        return [item, ...prevItems];
      }

      return prevItems;
    });
  };

  const removeFromWishlist = (slug) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.currentSlug !== slug)
    );
  };

  return (
    <>
      <WishlistContext.Provider
        value={{ wishlistItems, addToWishlist, removeFromWishlist }}
      >
        {children}
      </WishlistContext.Provider>
    </>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
