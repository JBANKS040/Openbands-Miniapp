import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  const projectName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Openbands";
  
  return {
    title: projectName,
    description: "Openbands Mini App",
    other: {
      'fc:frame': JSON.stringify({
        version: 'next',
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || (URL ? `${URL}/hero.png` : undefined),
        ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE || (URL ? `${URL}/hero.png` : undefined),
        heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || (URL ? `${URL}/hero.png` : undefined),
        button: {
          title: `Launch ${projectName}`,
          action: {
            type: 'launch_frame',
            name: projectName,
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE || URL ? `${URL}/splash.png` : undefined,
            splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#0000ff",
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}