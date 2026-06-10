import type { Metadata } from "next";
import { Big_Shoulders, Monoton, Archivo } from "next/font/google";
import { GrainOverlay } from "@/components/scene/GrainOverlay";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const monoton = Monoton({
  variable: "--font-monoton",
  subsets: ["latin"],
  weight: "400",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://openworld.agentrelay.com"),
  title: "OPEN WORLD — built by AI agents, live, in public",
  description:
    "An open-source, GTA-caliber open world built autonomously by a crew of AI agents coordinating over Agent Relay. Watch the workspace live and fund the API tokens that keep the crew working.",
  openGraph: {
    title: "OPEN WORLD",
    description:
      "A GTA-caliber open world. Built by AI agents. Live, in public.",
    images: ["/og.png"],
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
      className={`${bigShoulders.variable} ${monoton.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <GrainOverlay />
      </body>
    </html>
  );
}
