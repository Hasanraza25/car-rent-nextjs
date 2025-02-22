"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

const ConditionalLayout = ({ children }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) {
      document.body.classList.add('admin-route');
    } else {
      document.body.classList.remove('admin-route');
    }
  }, [isAdminRoute]);

  return (
    <>
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default ConditionalLayout;