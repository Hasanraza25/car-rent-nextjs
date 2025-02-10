"use client";
import Image from "next/image";
import { useState } from "react";

const ReviewsSection = ({ reviews }) => {
  const [visibleReviews, setVisibleReviews] = useState(2);

  const handleShowMore = () => {
    setVisibleReviews((prev) => prev + 2);
  };

  return (
    <div className="py-12 max-w-[1700px] mx-auto w-full">
      <div className="px-4">
        <div className="flex items-center space-x-6 mb-5 ml-5">
          <h2 className="text-2xl font-semibold">Reviews</h2>
          <span className="text-white bg-[#3563E9] px-4 py-2 rounded-lg">
            {reviews.length}
          </span>
        </div>

        <div className="flex flex-col bg-white rounded-lg shadow-md w-full">
          {reviews.slice(0, visibleReviews).map((review, index) => (
            <>
              <div
                key={review._id}
                className="p-6 rounded-lg flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-7 w-full animate-slideIn"
              >
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <Image
                    src={
                      review.userImage
                        ? review.userImage
                        : "/images/no-profile.png"
                    }
                    alt={review.userName}
                    width={70}
                    height={70}
                    className="w-[70px] h-[70px] rounded-full"
                    priority
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap gap-2 justify-between">
                    <h3 className="text-xl font-bold">{review.userName}</h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-between">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${
                            i < review.rating ? "text-yellow-500" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 leading-8 text-base">
                    {review.reviewText}
                  </p>
                </div>
              </div>
              {index < reviews.slice(0, visibleReviews).length - 1 && (
                <div className="flex justify-center my-4">
                  <div className="w-11/12 border-t border-dashed border-gray-300"></div>
                </div>
              )}
            </>
          ))}

          {visibleReviews < reviews.length && (
            <div className="text-center my-10">
              <button
                onClick={handleShowMore}
                className="text-gray-400 hover:underline flex items-center justify-center space-x-2 text-center mx-auto"
              >
                <span>Show All</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.7l3.71-3.47a.75.75 0 111.04 1.08l-4.25 4a.75.75 0 01-1.04 0l-4.25-4a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;