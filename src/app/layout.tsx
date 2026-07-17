import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/global-components/layout/footer";
import NavBar from "@/global-components/layout/sidebar/Sidebar";
import { SearchMatchHighlight } from "@/global-components/search-match-highlight";
import { PageDissolveTransition } from "@/global-components/transitions/page-dissolve-transition";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MUAS Website",
  description: "Monash Uncrewed Aerial Systems",
  icons: {
    icon: [
      {
        url: "/favicon/favicon-16x16.png?v=20260624",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon/favicon-32x32.png?v=20260624",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: "/favicon/favicon-32x32.png?v=20260624",
    apple: [
      {
        url: "/favicon/apple-touch-icon.png?v=20260624",
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
    <html lang="en" className="h-full bg-background">
      <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
        <NavBar />
        <Suspense fallback={null}>
          <SearchMatchHighlight />
        </Suspense>
        {/* Offset page content below the fixed top navigation bar. */}
        <div className="flex min-h-dvh flex-1 flex-col bg-background pt-20">
          <main className="flex w-full flex-1 flex-col bg-background">
            <PageDissolveTransition>{children}</PageDissolveTransition>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
