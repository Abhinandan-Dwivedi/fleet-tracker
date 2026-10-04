import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { SessionProvider } from "@/components/SessionProvider";
import "./globals.css";
import { TRPCProvider } from "@/components/TRPCProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "FleetTrack — Live fleet & delivery operations",
  description:
    "Track every vehicle live, dispatch deliveries, and share status links with customers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body>
         <SessionProvider>
          <TRPCProvider>{children}</TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
