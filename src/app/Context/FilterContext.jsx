"use client";
import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    categories: [],
    capacities: [],
    price: 100,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <FilterContext.Provider
      value={{ filters, setFilters, isSidebarOpen, toggleSidebar, applyFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
