"use client";
import { useUser, useClerk, useAuth } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  ArrowLeftOnRectangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useProfile } from "../Context/ProfileCOntext";

export default function ProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { user: clerkUser, openSignIn } = useClerk();
  const { getToken } = useAuth();
  const { profileImage, setProfileImage } = useProfile(); // Syncs with Header

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [previewImage, setPreviewImage] = useState(profileImage);
  const [imageUploading, setImageUploading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user && isLoaded) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.emailAddresses[0]?.emailAddress || "");
      setProfileImage(user.imageUrl || "/images/no-profile.png");
      setPreviewImage(user.imageUrl || "/images/no-profile.png");
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
    setImageUploading(true);

    try {
      const token = await getToken();

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

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      throw new Error("New password and confirm password do not match.");
    }

    try {
      if (!clerkUser) {
        throw new Error("User not found.");
      }

      // Update password using Clerk API
      await clerkUser.updatePassword({
        currentPassword: oldPassword,
        newPassword,
      });

      // Clear password fields on success
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // ✅ No success toast here, handle it in `handleUpdateProfile`
    } catch (error) {
      throw new Error(error.message || "Failed to change password.");
    }
  };

  const handleUpdateProfile = async () => {
    setUpdatingProfile(true);

    try {
      if (!clerkUser) {
        throw new Error("User not found.");
      }

      let updateSuccess = true;
      let hasChanges = false; // Track if anything was actually changed

      // Update Name (Only if changed)
      if (firstName !== user?.firstName || lastName !== user?.lastName) {
        hasChanges = true;
        try {
          await clerkUser.update({ firstName, lastName });
        } catch (error) {
          toast.error("Failed to update name.");
          console.error("Error updating name:", error);
          updateSuccess = false;
        }
      }

      // Update Profile Image (Only if a new image is selected)
      if (fileInputRef.current?.files[0]) {
        hasChanges = true;
        try {
          await handleImageUpload();
        } catch (error) {
          toast.error("Failed to update profile image.");
          console.error("Error updating image:", error);
          updateSuccess = false;
        }
      }

      // Update Password (Only if a new password is provided)
      if (oldPassword || newPassword || confirmPassword) {
        hasChanges = true;
        try {
          await handleChangePassword(); // This function needs to properly throw errors
        } catch (error) {
          toast.error("Failed to update password: " + error.message);
          console.error("Error updating password:", error);
          updateSuccess = false;
        }
      }

      // ✅ Show success toast only if at least one thing was changed & everything was successful
      if (hasChanges && updateSuccess) {
        await clerkUser.reload();
        setProfileImage(clerkUser?.imageUrl || "/images/no-profile.png");
        toast.success("Profile updated successfully!", {
          position: "top-right",
        });
      } else if (!hasChanges) {
        toast.info("No changes were made.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!isSignedIn)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-50 to-blue-50 text-center animate-fadeInSlideUp">
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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-50 py-10 px-5 animate-fadeInSlideUp">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">
            Edit Profile
          </h1>
          <div className="flex flex-col items-center space-y-8">
            {/* Profile Picture Upload */}
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
              <div
                className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer transition-all duration-300"
                onClick={() => fileInputRef.current.click()}
              >
                {/* Profile Image */}
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Change Photo Overlay */}
              </div>
              {imageUploading && (
                <p className="text-sm text-gray-500 absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 rounded-full">
                  Uploading...
                </p>
              )}
            </div>

            <div className="w-full space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-lg cursor-not-allowed"
                />
              </div>

              {/* Password Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Old Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <button
                onClick={handleUpdateProfile}
                className="w-full animated-button text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2  focus:ring-offset-2"
                disabled={updatingProfile}
              >
                {updatingProfile ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
