const { createContext, useContext, useEffect } = require("react");

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const storedWishlistItemss = localStorage.getItem("wishlistItems");
    if (storedWishlistItemss) {
      setWishlistItems(JSON.parse(storedWishlistItemss));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (item) => {
    setWishlistItems((prevItems) => {
      return [item, ...prevItems];
    });
  };

//   const removeTo
  return (
    <>
      <WishlistContext.Provider
        value={{ wishlistItems, addToWishlist }}
      ></WishlistContext.Provider>
    </>
  );
};
