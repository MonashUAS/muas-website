import type { Metadata } from "next";
import { Footer } from "@/global-components/layout/footer";
import NavBar from "@/global-components/layout/sidebar/Sidebar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MUAS Website",
  description: "Monash Uncrewed Aerial Systems",
  icons: {
    icon: [
      {
        url: "/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: "/favicon/favicon-32x32.png",
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <NavBar />
        <div className="flex min-h-screen flex-1 flex-col pl-[68px]">
          <main className="w-full flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
