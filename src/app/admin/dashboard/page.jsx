"use client";
import AdminLayout from "@/app/components/Admin/AdminLayout";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// Import necessary components from the admin panel template

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
    <AdminLayout>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel.</p>
      <button onClick={() => signOut({ callbackUrl: "/" })}>Logout</button>
      {/* Add more admin functionalities here */}
    </AdminLayout>
  );
};

export default AdminDashboard;
