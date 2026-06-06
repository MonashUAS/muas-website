import type { Metadata } from "next";
import { Footer } from "@/global-components/layout/Footer";
import NavBar from "@/global-components/layout/Sidebar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MUAS Website",
  description: "Melbourne University Aerospace Society",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-background text-foreground antialiased">
        <NavBar />
        <main className="min-h-screen pl-[68px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
