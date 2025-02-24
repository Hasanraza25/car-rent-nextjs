"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardCards from "../components/DashboardCards";
import DashboardCharts from "../components/DashboardCharts";
import RecentBookings from "../components/RecentBookings";
import QuickActions from "../components/QuickActions";

const AdminDashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/admin/login");
    }
  }, [session]);

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="p-6 space-y-6">
        <DashboardCards />
        <DashboardCharts />
        <RecentBookings />
        <QuickActions />
      </div>
    </>
  );
};

export default AdminDashboard;
