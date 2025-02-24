"use client";
import { useRouter } from "next/navigation";

const QuickActions = () => {
  const router = useRouter();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => router.push("/admin/cars/add")}
        >
          Add New Car
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => router.push("/admin/promotions")}
        >
          Manage Promotions
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
