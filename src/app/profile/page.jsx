"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { useProfile } from "@/app/context/ProfileContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowLeftOnRectangleIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function ProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { user: clerkUser, openSignIn } = useClerk();
  const { profileImage, setProfileImage } = useProfile(); // Syncs with Header

  // State for user details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [previewImage, setPreviewImage] = useState(profileImage);
  const [imageUploading, setImageUploading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const fileInputRef = useRef(null); // Reference for hidden input

  // Load user details when available
  useEffect(() => {
    if (user && isLoaded) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.emailAddresses[0]?.emailAddress || "");
      setProfileImage(user.imageUrl || "/images/no-profile.png");
    }
  }, [user, isLoaded]);

  // Handle Image Upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result); // Show preview instantly
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) return;

    setImageUploading(true);

    try {
      await clerkUser?.setProfileImage(file);
      await clerkUser?.reload(); // 🔄 Force refresh user data

      const newImageUrl = clerkUser?.imageUrl; // Get new image URL
      setProfileImage(newImageUrl || "/images/no-profile.png"); // Update context
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setImageUploading(false);
    }
  };

  // Handle Profile Update
  const handleUpdateProfile = async () => {
    setUpdatingProfile(true);

    try {
      await clerkUser?.update({ firstName, lastName }); // Update name
      await handleImageUpload(); // Upload the image

      await clerkUser?.reload(); // 🔄 Force update Clerk's user data
      setProfileImage(clerkUser?.imageUrl || "/images/no-profile.png"); // Sync latest image

      toast.success("Profile updated successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (!isSignedIn)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#2C3E50] to-[#1C2833] text-white text-center"
      >
        {/* Animated Lock Icon */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <LockClosedIcon className="w-24 h-24 text-white bg-gray-900 p-5 rounded-full shadow-lg animate-pulse" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-4xl font-extrabold mt-5"
        >
          Access Denied
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-lg text-gray-300 mt-3 max-w-lg px-6"
        >
          Oops! You need to be signed in to view your profile. Please log in to
          access your account.
        </motion.p>

        {/* Animated Image */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Image
            src="/images/auth-lock.svg" // Change this to an appropriate lock/security image
            alt="Login Required"
            width={300}
            height={300}
            className="mt-6 drop-shadow-lg"
          />
        </motion.div>

        {/* Login Button */}
        <motion.button
          onClick={openSignIn}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-8 px-6 py-3 bg-[#db4444] hover:bg-[#fa4545] text-white font-semibold text-lg rounded-full flex items-center gap-2 shadow-lg transition-all duration-300"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          Sign In Now
        </motion.button>
      </motion.div>
    );
  return (
    <div className="container mx-auto my-10 px-5">
      <h1 className="text-2xl font-bold mb-5">Edit Profile</h1>

      {/* Profile Picture Upload (Clickable Image) */}
      <div className="mb-5 text-center">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
        <img
          src={previewImage} // Show preview instantly
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto border border-gray-300 cursor-pointer"
          onClick={() => fileInputRef.current.click()} // Click opens file picker
        />
        {imageUploading && (
          <p className="text-sm text-gray-500">Uploading...</p>
        )}
      </div>

      {/* First Name */}
      <div className="mb-5">
        <label className="block text-sm font-medium">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Last Name */}
      <div className="mb-5">
        <label className="block text-sm font-medium">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Email (Disabled) */}
      <div className="mb-5">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-4 py-2 border bg-gray-100 rounded-lg cursor-not-allowed"
        />
      </div>

      {/* Update Profile Button */}
      <button
        onClick={handleUpdateProfile}
        className="px-6 py-3 bg-[#db4444] hover:bg-[#fa4545] text-white font-semibold rounded-full transition-all duration-300"
        disabled={updatingProfile}
      >
        {updatingProfile ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
}
