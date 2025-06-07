import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-calendar/dist/Calendar.css';
import { UserProvider } from "./context/UserContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrainHub | A Modern Learning Platform",
  description:
    "TrainHub – A modern learning platform to deliver, track, and manage skills-based training for individuals and teams.",
  keywords: [
    "Skills learning platform",
    "Online training platform",
    "E-learning system",
    "Digital learning hub",
    "Course management system",
    "Learning management system",
    "Skill development app",
    "Training delivery software",
    "Instructor dashboard",
    "Student progress tracking",
    "Video-based learning",
  ],
  icons: {
    icon: "/favicon.svg", // You can also add `apple: '/apple-touch-icon.png'` if needed
  },
  metadataBase: new URL("https://trainhub.yourdomain.com"), // Replace with your actual domain
  openGraph: {
    title: "TrainHub | A Modern Learning Platform",
    description:
      "TrainHub empowers individuals and teams to master skills through structured online training.",
    url: "https://trainhub.yourdomain.com",
    siteName: "TrainHub",
    images: [
      {
        url: "/og-image.svg", // Add this image in your public folder
        width: 1200,
        height: 630,
        alt: "TrainHub Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrainHub | A Modern Learning Platform",
    description:
      "Deliver, manage, and track online training with TrainHub – a modern platform for skills development.",
    images: ["/og-image.svg"], // Ensure this image is in your public folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          {children}
        </UserProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }} // Ensure the toast container is above other elements
        />
      </body>
    </html>
  );
}
