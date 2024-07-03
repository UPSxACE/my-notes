import { auth } from "@/auth";
import ApolloClientProvider from "@/context/apollo";
import WebsocketProvider from "@/context/websocket";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import RootLayoutPrivate from "./layout-private";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
});

const fontSans = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MyNotes",
  description: "Open source note-taking app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <WebsocketProvider>
      <ApolloClientProvider>
        <html lang="en" className="scroll-smooth overflow-hidden">
          <body className={cn(fontSans.variable, inter.className)}>
            <RootLayoutPrivate>{children}</RootLayoutPrivate>
          </body>
        </html>
      </ApolloClientProvider>
    </WebsocketProvider>
  );
}
