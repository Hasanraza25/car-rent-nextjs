"use client";
import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const reservation_id = searchParams.get('reservation_id');
  const soundRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    soundRef.current = new Howl({
      src: ["/success-sound.mp3"],
      volume: 0.5,
      onplay: () => {
        console.log("Sound played successfully");
      },
      onloaderror: (error) => {
        console.error("Failed to load sound:", error);
      },
      onplayerror: (error) => {
        console.error("Failed to play sound:", error);
      },
    });

    soundRef.current.play();

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  const handleViewReservation = () => {
    router.push(`/reservations/${reservation_id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-500 hover:scale-105">
        <div className="flex justify-center mb-6">
          <video autoPlay muted playsInline className="w-32 h-32">
            <source src="/verify.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for your payment. Your rental is now confirmed.
        </p>

        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600">Reservation ID:</p>
          <p className="text-lg font-mono text-green-700 break-all">
            {reservation_id}
          </p>
        </div>

        <button
          onClick={handleViewReservation}
          className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 hover:shadow-lg"
        >
          View Reservation
        </button>

        <p className="text-sm text-gray-500 mt-6">
          Need help?{" "}
          <a href="/contact" className="text-green-600 hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}