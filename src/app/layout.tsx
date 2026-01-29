import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@uploadthing/react/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eventhorizon.com"),

  title: {
    default: "EventHorizon",
    template: "%s | EventHorizon",
  },

  description:
    "Book, manage, and discover events effortlessly with EventHorizon.",

  applicationName: "EventHorizon",

  keywords: [
    "events",
    "tickets",
    "event booking",
    "concert tickets",
    "event management",
  ],

  authors: [{ name: "EventHorizon Team" }],

  openGraph: {
    title: "EventHorizon",
    description: "Book and manage your event tickets with ease.",
    url: "https://eventhorizon.com",
    siteName: "EventHorizon",
    images: [
      {
        url: "/2.png",
        width: 1200,
        height: 630,
        alt: "EventHorizon – Event Booking Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "EventHorizon",
    description: "Book and manage your event tickets with ease.",
    images: ["/2.png"],
  },

  icons: {
    icon: "/2.png",
    shortcut: "/2.png",
    apple: "/2.png",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
