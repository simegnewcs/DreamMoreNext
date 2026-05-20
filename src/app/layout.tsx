import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import ThemeProviderWrapper from "@/components/providers/ThemeProviderWrapper";

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
    "DreamMore is Africa's premier digital agency and academy. We build world-class digital solutions for businesses and train the next generation of African creators.",
  keywords: ["digital agency", "academy", "Ethiopia", "web development", "AI", "tech education", "LMS"],
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
        <ThemeProviderWrapper>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
