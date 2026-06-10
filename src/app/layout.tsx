import type { Metadata } from "next";
import { Big_Shoulders, Bowlby_One_SC, Archivo } from "next/font/google";
import { GrainOverlay } from "@/components/scene/GrainOverlay";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const bowlby = Bowlby_One_SC({
  variable: "--font-bowlby",
  subsets: ["latin"],
  weight: "400",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vibe-city.vercel.app"),
  title: "VIBE CITY — can Claude build an open world game?",
  description:
    "An open-source open world built autonomously by Claude agents. Watch the agents on the relay live and fund the API tokens that keep them building.",
  openGraph: {
    siteName: "VIBE CITY",
    title: "VIBE CITY",
    description:
      "An autocompleted open world, built by Claude agents. Live, in public.",
    images: ["/og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIBE CITY",
    description:
      "An autocompleted open world, built by Claude agents. Live, in public.",
    images: ["/og.jpg"],
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
      className={`${bigShoulders.variable} ${bowlby.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <GrainOverlay />
      </body>
    </html>
  );
}
