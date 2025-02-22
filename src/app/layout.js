import localFont from "next/font/local";
import "./globals.css";
import { WishlistProvider } from "./Context/WishlistContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ProfileProvider } from "./Context/ProfileCOntext";
import { SessionProvider } from "next-auth/react";
import ClientSessionProvider from "./components/ClientSessionProvider";
import ConditionalLayout from "./components/ConditionalLayout";

const jakartaSans = localFont({
  src: "./fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Medium.ttf",
  variable: "--font-jakarata-sans",
  weight: "100 200 300 400 500 600 700 800 900",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Morent",
  description: "Developed By Hasan Raza",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className={`${jakartaSans.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <ProfileProvider>
            <WishlistProvider>
              <ToastContainer />
              <ClientSessionProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
              </ClientSessionProvider>
            </WishlistProvider>
          </ProfileProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
