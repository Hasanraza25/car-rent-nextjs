"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ReviewsSection from "@/app/components/ReviewSection/ReviewSection";
import RecentCars from "@/app/components/Cars/RecentCars";
import { client, urlFor } from "@/sanity/lib/client";
import { useWishlist } from "@/app/Context/WishlistContext";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import Swal from "sweetalert2";

const CarDetail = ({ params }) => {
  const slug = params.carSlug;
  const [car, setCar] = useState([]);
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { user, isSignedIn } = useUser();

  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const getCars = async () => {
    try {
      setLoading(true);
      const query = `*[_type == 'car']{
      _id,
          name,
          "category": type->name,
          price,
          stock,
          image,
          discount,
          steering,
          fuelCapacity,
          seatingCapacity,
          description,
          "currentSlug": slug.current,
          "categorySlug": type->slug.current,
        }`;
      const products = await client.fetch(query);
      setCar(products.find((car) => car.currentSlug === slug));
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const query = `*[_type == "review" && carId == "${car._id}"] | order(date desc)`;
      const data = await client.fetch(query);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  useEffect(() => {
    if (car._id) {
      fetchReviews();
    }
  }, [car._id]);

  useEffect(() => {
    if (wishlistItems.some((item) => item.currentSlug === car.currentSlug)) {
      setIsHeartClicked(true);
    }
  }, [wishlistItems, car.currentSlug]);

  const heartUnfilled = "/images/heart-unfilled.svg";
  const heartFilled = "/images/heart-filled.svg";

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    setIsHeartClicked(!isHeartClicked);
    if (isHeartClicked) {
      removeFromWishlist(car.currentSlug);
    } else {
      addToWishlist(car);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You need to Sign in!",
      });
      return;
    }

    if (rating === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select at least one star!",
      });
      return;
    }

    setSubmitting(true);

    const review = {
      _type: "review",
      carId: car._id,
      userId: user.id,
      userName: user.fullName,
      userImage: user.imageUrl,
      rating,
      reviewText,
      date: new Date().toISOString(),
    };

    try {
      await client.create(review);
      setReviewText("");
      setRating(0);
      fetchReviews();
      Swal.fire({
        icon: "success",
        title: "Review Submitted Successfully!",
        showConfirmButton: true,
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      console.error("Error Occured:", err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    } finally {
      setSubmitting(false);
    }
  };
  if (!car) {
    return <div>Car not found</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* <Sidebar /> */}
        <div className="flex flex-col w-full px-4 sm:px-2">
          <div className="flex flex-col md:flex-row justify-around mx-auto w-full mt-5 max-w-[1700px]">
            {/* Card 1 */}
            <div className="relative rounded-lg text-white flex flex-col justify-evenly p-6 sm:p-0 mb-8 w-full sm:w-[90%] md:w-[45%] mx-auto">
              {/* Main Content with Background Image */}
              <div
                className="relative z-10 py-10 bg-cover bg-center rounded-lg"
                style={{
                  backgroundImage: "url('/images/hero-arrows.svg')",
                }}
              >
                <h1 className="text-white text-[2.5rem] sm:text-[1.5rem] w-full sm:w-[80%] leading-snug px-5">
                  Sports car with the best design and acceleration
                </h1>
                <p className="text-lg mt-5 leading-8 font-light w-full sm:line-clamp-3 px-5">
                  Safety and comfort while driving a futuristic and elegant
                  sports car
                </p>

                <Image
                  src={car.image ? urlFor(car.image).url() : ""}
                  alt="Car"
                  className="mx-auto mt-6 sm:mt-4 w-full max-w-[300px] rounded-lg"
                  width={300} // Define a fixed width or use dynamic width depending on your layout
                  height={200} // Define a fixed height or use dynamic height
                  layout="responsive" // Ensures the image is responsive
                  priority
                />
              </div>

              {/* Flex Container for Smaller Images */}
              <div className="flex flex-wrap mt-12 sm:mt-8 gap-4 justify-around  z-20">
                <div className="flex items-center relative w-[200px] h-[120px] sm:w-[100px] sm:h-[80px]">
                  <div
                    className="absolute inset-0 bg-cover bg-center z-10 rounded-xl"
                    style={{
                      backgroundImage: "url('/images/look.svg')",
                    }}
                  ></div>
                  <Image
                    src={
                      car.image
                        ? urlFor(car.image).url()
                        : "/images/placeholder.jpg"
                    }
                    alt="Car"
                    width={160} // Adjust based on 80% of the container
                    height={96} // Adjust based on 80% of the container
                    className="absolute left-1/2 top-1/2 object-contain z-20 w-[80%] transform -translate-x-1/2 -translate-y-1/2"
                    priority
                  />
                </div>
                <Image
                  src="/images/car-view-2.svg"
                  alt="Car View 2"
                  width={200}
                  height={120}
                  className="w-[200px] h-[120px] sm:w-[100px] sm:h-[80px] rounded-lg object-cover"
                  priority
                />
                <Image
                  src="/images/car-view-3.svg"
                  alt="Car View 3"
                  width={200}
                  height={120}
                  className="w-[200px] h-[120px] sm:w-[100px] sm:h-[80px] rounded-lg object-cover"
                  priority
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative w-full md:w-[45%] md:max-h-[42rem]  lg:max-h-[35rem] sm:w-[90%] bg-white shadow-md rounded-lg mx-auto p-4 md:mt-6">
              <div className="p-3">
                <Link href={`/cars/${car.currentSlug}`}>
                  <h3 className="text-4xl font-semibold cursor-pointer">
                    {car.name}
                  </h3>
                </Link>
                <div className="flex mt-3">
                  <img src="/images/review-stars.svg" alt="Review Stars" />
                  <p className="ml-3 text-gray-400 text-sm">440+ Reviewier</p>
                </div>
                <p className="text-gray-500 mt-5 text-[1.3rem] leading-10 font-normal">
                  NISMO has become the embodiment of Nissan&#39;s outstanding
                  performance, inspired by the most unforgiving proving ground,
                  the &quot;race track&quot;.
                </p>
              </div>

              <div className="absolute top-6 right-4">
                <button
                  className="bg-white w-8 h-8 rounded-full flex items-center justify-center hover:text-red-500"
                  onClick={handleAddToWishlist}
                >
                  <img
                    src={isHeartClicked ? heartFilled : heartUnfilled}
                    alt="Heart Icon"
                    className="w-6 h-6"
                  />
                </button>
              </div>

              <div className="flex flex-col md:flex-row justify-between mx-2 mt-3 space-y-2 md:space-y-0 md:space-x-4 text-sm text-[#90A3BF]">
                <div className="flex  flex-wrap md:flex-col lg:flex-row items-center justify-between w-full text-lg">
                  <span>Type Car:</span>
                  <span className="text-gray-600">{car.category}</span>
                </div>
                <div className="flex flex-wrap md:flex-col lg:flex-row items-center justify-between w-full text-lg">
                  <span>Capacity:</span>
                  <span className="text-gray-600">
                    {car.seatingCapacity} Person
                  </span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between mx-2 mt-2 space-y-2 md:space-y-0 md:space-x-4 text-sm text-[#90A3BF]">
                <div className="flex  flex-wrap md:flex-col lg:flex-row items-center justify-between w-full text-lg">
                  <span>Steering:</span>
                  <span className="text-gray-600">{car.steering}</span>
                </div>
                <div className="flex flex-wrap md:flex-col lg:flex-row items-center justify-between w-full text-lg">
                  <span>Gasoline:</span>
                  <span className="text-gray-600">{car.fuelCapacity}L</span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mt-10 text-center">
                <div className="flex flex-wrap items-center justify-between sm:justify-center gap-4 space-x-4">
                  <div className="text-left">
                    <span className="text-black text-3xl font-bold block">
                      ${car.price}.00/
                      <span className="text-[#90A3BF] text-xl">days</span>
                    </span>
                    <span className="text-[#90A3BF] text-base line-through block mt-1">
                      {car.discount}
                    </span>
                  </div>
                  <Link href={`/rent/${car.currentSlug}`}>
                    <button className="bg-[#3563E9] hover:bg-[#54A6FF] py-3 px-5 text-white text-lg rounded-md">
                      Rent Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {isSignedIn && (
            <div className="container mt-10  px-10 py-8 rounded-lg w-full max-w-[1700px] mx-auto">
              <h3 className="text-3xl font-semibold mb-6 text-center">
                Leave a Review
              </h3>
              <p className="text-center text-gray-600 mb-6">
                Your feedback is valuable to us. Please leave your review and
                rating below.
              </p>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="flex items-center justify-center mb-6">
                  <label className="mr-4 text-lg">Rating:</label>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-colors duration-200 ${
                        rating >= star ? "text-yellow-500" : "text-gray-300"
                      } hover:text-yellow-500 focus:outline-none`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="5"
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your review here..."
                  required
                ></textarea>
                <button
                  type="submit"
                  className="animated-button text-lg w-60 mt-10 py-4 mx-auto text-white text-center rounded-[5px]"
                  disabled={submitting}
                >
                   {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}

          <ReviewsSection reviews={reviews} />
          <RecentCars />
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
