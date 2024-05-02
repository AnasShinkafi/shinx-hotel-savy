import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import Container from "@/components/Container";
import { Toaster } from "@/components/ui/toaster";
import LocationFilter from "@/components/LocationFilter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shinx Savy",
  description: "Book a hotel of your choic+e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Toaster />
            <main className="flex flex-col min-h-screen">
              <Navbar />
              <LocationFilter />
              <section className="flex-grow">
                <Container>
                  {children}
                </Container>
              </section>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}