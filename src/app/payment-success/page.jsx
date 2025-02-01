
export default function PaymentSuccess({ searchParams }) {
  const { payment_intent } = searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      {/* Success Container */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-500 hover:scale-105">
        {/* Green Tick GIF */}
        <div className="flex justify-center mb-6">
          <div className="flex justify-center mb-6">
            <video
              autoPlay
              muted
              playsInline
              preload="auto"
              className="w-32 h-32"
            >
              <source src="/verify.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for your payment. Your rental is now confirmed.
        </p>

        {/* Payment Intent ID */}
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600">Payment Intent ID:</p>
          <p className="text-lg font-mono text-green-700 break-all">
            {payment_intent}
          </p>
        </div>

        {/* Return Home Button */}
        <a
          href="/"
          className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 hover:shadow-lg"
        >
          Return Home
        </a>

        {/* Additional Message */}
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
