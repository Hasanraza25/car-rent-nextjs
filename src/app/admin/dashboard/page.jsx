"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel.</p>
      <button onClick={() => signOut({ callbackUrl: "/" })}>Logout</button>
    </>
  );
};

export default AdminDashboard;
