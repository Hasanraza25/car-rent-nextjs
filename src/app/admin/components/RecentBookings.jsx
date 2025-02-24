"use client";
const RecentBookings = () => {
  const bookings = [
    { customer: "John Doe", car: "Tesla Model X", status: "Completed", date: "12 Feb 2024" },
    { customer: "Alice Smith", car: "BMW X5", status: "Pending", date: "15 Feb 2024" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Customer</th>
            <th className="p-2">Car</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{booking.customer}</td>
              <td className="p-2">{booking.car}</td>
              <td className="p-2">{booking.status}</td>
              <td className="p-2">{booking.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentBookings;
