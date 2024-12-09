"use client";
import { useState } from "react";

const ReviewsSection = () => {
  // State to manage the visible reviews
  const [visibleReviews, setVisibleReviews] = useState(2);

  // Dummy reviews data
  const reviews = [
    {
      id: 1,
      name: "Alex Stanton",
      date: "21 July 2022",
      role: "CEO at Bukalapak",
      text: "We are very happy with the service from the MORENT App. Morent has a low price and also a large variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite.",
      image: "/images/review-1.svg",
    },
    {
      id: 2,
      name: "Skylar Dias",
      date: "20 July 2022",
      role: "CEO at Amazon",
      text: "We are greatly helped by the services of the MORENT Application. Morent has low prices and also a wide variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite.",
      image: "/images/review-2.svg",
    },
    {
      id: 3,
      name: "Emma Watson",
      date: "19 July 2022",
      role: "Marketing Manager at Google",
      text: "Morent App offers fantastic services with excellent car options. Their support team is responsive and very professional.",
      image: "/images/review-1.svg",
    },
    {
      id: 4,
      name: "John Doe",
      date: "18 July 2022",
      role: "CTO at Microsoft",
      text: "Using Morent App has been a wonderful experience. Affordable prices and excellent car variety are their strong points.",
      image: "/images/review-2.svg",
    },
  ];

  const handleShowMore = () => {
    setVisibleReviews((prev) => prev + 2); // Load 2 more reviews
  };

  return (
    <div className="py-12 max-w-[1450px] mx-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-6 mb-5 ml-5">
          <h2 className="text-2xl font-semibold">Reviews</h2>
          <span className="text-white bg-[#3563E9] px-4 py-2 rounded-lg">
            {reviews.length}
          </span>
        </div>

        <div className="flex flex-col bg-white shadow-md w-full">
          {reviews.slice(0, visibleReviews).map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-lg flex space-x-7 w-full"
            >
              <div>
                <img
                  src={review.image}
                  alt={review.name}
                  width={70}
                  height={70}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold">{review.name}</h3>
                  <p className="text-gray-500 text-sm">{review.date}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-400 mt-4">{review.role}</p>
                  <img src="/images/review-stars.svg" alt="Rating" />
                </div>
                <p className="mt-4 text-gray-600 leading-8 text-base">
                  {review.text}
                </p>
              </div>
            </div>
          ))}

          {/* "Show More" Button */}
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
