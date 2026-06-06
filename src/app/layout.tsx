import type { Metadata } from "next";
import { Footer } from "@/global-components/layout/footer";
import { NavBar } from "@/global-components/layout/nav-bar";
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
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
