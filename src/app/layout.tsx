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
  metadataBase: new URL("https://gta-vibe-city.vercel.app"),
  title: "GTA: VIBE CITY — Grand Theft Autocomplete",
  description:
    "An open-source open world built autonomously by AI agents. Watch the workspace live and fund the API tokens that keep the crew building.",
  openGraph: {
    siteName: "GTA: VIBE CITY",
    title: "GTA: VIBE CITY",
    description:
      "Grand Theft Autocomplete. An open world built by AI agents. Live, in public.",
    images: ["/og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA: VIBE CITY",
    description:
      "Grand Theft Autocomplete. An open world built by AI agents. Live, in public.",
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
