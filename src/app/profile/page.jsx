"use client";
import { useUser, useClerk, useAuth } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { useProfile } from "@/app/context/ProfileCOntext";
import { toast } from "react-toastify";
import {
  ArrowLeftOnRectangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function ProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { user: clerkUser, openSignIn } = useClerk();
  const { getToken } = useAuth();
  const { profileImage, setProfileImage } = useProfile(); // Syncs with Header

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [previewImage, setPreviewImage] = useState(profileImage);
  const [imageUploading, setImageUploading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      console.log("🔍 Clerk Token:", token);
    };

    fetchToken();
  }, []);

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
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      toast.error("No file selected!");
      return;
    }

    setImageUploading(true);

    try {
      const token = await getToken();
      console.log("🔍 Clerk Token:", token);

      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("file", file);

      console.log("Sending image to API...");

      const response = await fetch("/api/uploadProfileImage", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Ensure Clerk token is sent
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload Error:", errorData);
        throw new Error(errorData.error || "Failed to upload image.");
      }

      const data = await response.json();
      console.log("Upload Successful:", data);

      toast.success("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdatingProfile(true);

    try {
      await clerkUser?.update({ firstName, lastName });
      await handleImageUpload();

      await clerkUser?.reload();
      setProfileImage(clerkUser?.imageUrl || "/images/no-profile.png");

      toast.success("Profile updated successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (!isSignedIn)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-center animate-fadeInSlideUp">
        {/* Bouncing Lock Icon */}
        <div className="animate-bounce">
          <LockClosedIcon className="w-24 h-24 text-gray-900 bg-gray-200 p-5 rounded-full shadow-lg" />
        </div>

        <h1
          className="text-4xl font-extrabold mt-5 opacity-0 animate-fadeIn text-gray-900"
          style={{ animationDelay: "300ms" }}
        >
          Access Denied
        </h1>

        <p
          className="text-lg text-gray-600 mt-3 max-w-lg px-6 opacity-0 animate-fadeIn"
          style={{ animationDelay: "500ms" }}
        >
          Oops! You need to be signed in to view your profile. Please log in to
          access your account.
        </p>

        <button
          onClick={openSignIn}
          className="mt-8 px-6 py-3 bg-[#db4444] hover:bg-[#fa4545] text-white font-semibold text-lg rounded-full flex items-center gap-2 shadow-lg transition-transform transform hover:scale-105 duration-300 opacity-0 animate-fadeIn"
          style={{ animationDelay: "900ms" }}
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          Sign In Now
        </button>
      </div>
    );

  return (
    <div className="container mx-auto my-10 px-5 animate-fadeInSlideUp">
      <h1 className="text-2xl font-bold mb-5">Edit Profile</h1>

      {/* Profile Picture Upload */}
      <div className="mb-5 text-center">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
        <img
          src={previewImage}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto border border-gray-300 cursor-pointer transition-transform duration-300 hover:scale-110"
          onClick={() => fileInputRef.current.click()}
        />
        {imageUploading && (
          <p className="text-sm text-gray-500">Uploading...</p>
        )}
      </div>

      <button
        onClick={handleImageUpload}
        className="px-6 py-3 bg-[#db4444] hover:bg-[#fa4545] text-white font-semibold rounded-full transition-transform transform hover:scale-105 duration-300"
        disabled={imageUploading}
      >
        {imageUploading ? "Uploading..." : "Upload Image"}
      </button>

      <div className="mb-5">
        <label className="block text-sm font-medium">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-4 py-2 border bg-gray-100 rounded-lg cursor-not-allowed"
        />
      </div>

      <button
        onClick={handleUpdateProfile}
        className="px-6 py-3 bg-[#db4444] hover:bg-[#fa4545] text-white font-semibold rounded-full transition-transform transform hover:scale-105 duration-300"
        disabled={updatingProfile}
      >
        {updatingProfile ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
}
