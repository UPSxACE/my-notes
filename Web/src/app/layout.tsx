import { auth } from "@/auth";
import QueryProvider from "@/context/query";
import WebsocketProvider from "@/context/websocket";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import RootLayoutPrivate from "./layout-private";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
      <QueryProvider>
        <html lang="en" className={session ? "" : "scroll-smooth"}>
          <body className={cn(fontSans.variable, inter.className)}>
            <RootLayoutPrivate>{children}</RootLayoutPrivate>
            <Toaster richColors />
          </body>
        </html>
      </QueryProvider>
    </WebsocketProvider>
  );
}
