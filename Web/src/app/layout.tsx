import { auth } from "@/auth";
import ApolloClientProvider from "@/context/apollo";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

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
    <ApolloClientProvider>
      <html lang="en" className="scroll-smooth">
        <body className={cn(fontSans.variable)}>{children}</body>
      </html>
    </ApolloClientProvider>
  );
}
