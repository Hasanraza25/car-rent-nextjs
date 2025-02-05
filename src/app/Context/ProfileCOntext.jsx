"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { user } = useUser();
  const [profileImage, setProfileImage] = useState("/images/no-profile.png");

  // Load Clerk profile image when user is signed in
  useEffect(() => {
    if (user?.imageUrl) {
      setProfileImage(user.imageUrl);
    }
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook for easy access
export const useProfile = () => useContext(ProfileContext);
