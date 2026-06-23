import type { Metadata } from "next";
import { Footer } from "@/global-components/layout/footer";
import NavBar from "@/global-components/layout/sidebar/Sidebar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MUAS Website",
  description: "Monash Uncrewed Aerial Systems",
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
        <main className="grid min-h-screen grid-rows-[1fr_auto] pl-[68px]">
          {/* The grow utility forces this container to expand and take up all remaining vertical space */}
          <div className="w-full"> 
            {children} 
          </div>

          <Footer />
        </main>
        
      </body>
    </html>
  );
}
