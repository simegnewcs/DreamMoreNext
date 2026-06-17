import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import CookieConsent from "@/components/layout/CookieConsent";
import ThemeProviderWrapper from "@/components/providers/ThemeProviderWrapper";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DreamMore — Digital Innovation Ecosystem",
    template: "%s | DreamMore",
  },
  description:
    "DreamMore Digitals is Ethiopia's premier digital agency and tech academy in Addis Ababa & Bahir Dar. We offer web development, mobile apps, digital marketing, graphic design, UI/UX design, and programming courses (C++, Java, Python, JavaScript). Serving businesses across Ethiopia.",
  keywords: [
    "DreamMore",
    "DreamMore Digitals",
    "dream",
    "dreammore",
    "dream more",
    "dremmore",
    "drem more",
    "DreamMore Ethiopia",
    "DreamMore Addis Ababa",
    "DreamMore Bahir Dar",
    "dreammore bahirdar",
    "web development Ethiopia",
    "website design Addis Ababa",
    "website design Bahir Dar",
    "mobile app development Ethiopia",
    "digital marketing Ethiopia",
    "SEO services Ethiopia",
    "social media marketing Addis Ababa",
    "graphic design Ethiopia",
    "UI/UX design Ethiopia",
    "software development Ethiopia",
    "IT solutions Ethiopia",
    "coding bootcamp Ethiopia",
    "programming courses Addis Ababa",
    "programming courses Bahir Dar",
    "web development training Ethiopia",
    "digital marketing training",
    "graphic design courses Ethiopia",
    "learn coding Ethiopia",
    "software engineering training",
    "tech academy Ethiopia",
    "IT training Addis Ababa",
    "C++ Java Python courses",
    "tech company Ethiopia",
    "digital agency Addis Ababa",
    "digital agency Bahir Dar",
    "software company Ethiopia",
    "IT consultancy Ethiopia",
    "technology solutions Africa",
    "startup development Ethiopia",
    "e-commerce development Ethiopia",
    "business website Ethiopia",
    "web development Bole",
    "web developers CMC",
    "digital agency Mexico",
    "IT services Ayat",
    "software company Lebu"
  ],
  openGraph: {
    title: "DreamMore — Digital Innovation Ecosystem",
    description:
      "We build world-class digital solutions for businesses and train the next generation of African creators.",
    url: "https://dreammore.et",
    siteName: "DreamMore",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DreamMore — Digital Innovation Ecosystem",
    description: "Africa's premier digital agency and academy.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-white" suppressHydrationWarning>
        <NextAuthProvider>
          <ThemeProviderWrapper>
            <ConditionalLayout>
              {children}
              <CookieConsent />
            </ConditionalLayout>
          </ThemeProviderWrapper>
        </NextAuthProvider>
      </body>
    </html>
  );
}
