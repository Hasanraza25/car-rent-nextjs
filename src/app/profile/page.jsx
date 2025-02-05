"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useProfile } from "@/app/context/ProfileCOntext";

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();
  const { user: clerkUser } = useClerk();
  const { profileImage, setProfileImage } = useProfile(); // Use Profile Context

  // State for user details
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(
    user?.emailAddresses[0]?.emailAddress || ""
  );
  const [imageUploading, setImageUploading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.emailAddresses[0]?.emailAddress || "");
      setProfileImage(user.imageUrl || "/images/no-profile.png"); // Update from Clerk
    }
  }, [user]);

  // Function to handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageUploading(true);

    try {
      await clerkUser?.setProfileImage(file);
      setProfileImage(URL.createObjectURL(file)); // Update Profile Context
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setImageUploading(false);
    }
  };

  // Function to update user details
  const handleUpdateProfile = async () => {
    setUpdatingProfile(true);
    try {
      await clerkUser?.update({
        firstName,
        lastName,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (!isSignedIn) return <p>Please log in to edit your profile.</p>;

  return (
    <div className="container mx-auto my-10 px-5">
      <h1 className="text-2xl font-bold mb-5">Edit Profile</h1>

      {/* Profile Picture Upload */}
      <div className="mb-5 text-center">
        <img
          src={profileImage} // Syncs with the header
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto border border-gray-300"
        />
        <input
          type="file"
          accept="image/*"
          className="mt-2"
          onChange={handleImageUpload}
        />
        {imageUploading && <p className="text-sm text-gray-500">Uploading...</p>}
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
