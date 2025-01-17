"use client";
const { createContext, useContext, useEffect, useState } = require("react");

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

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
      return [item, ...prevItems];
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
