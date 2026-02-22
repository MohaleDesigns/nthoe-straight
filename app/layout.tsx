import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthProvider";
import HeaderWrapper from "./components/HeaderWrapper";
import CartSidebar from "./components/CartSidebar";
import FooterWrapper from "./components/FooterWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nthoe'Straight",
  description: "Premium fashion for the modern minimalist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-white text-gray-900`}
      >
        <AuthProvider>
          <CartProvider>
            <HeaderWrapper />
            <CartSidebar />
            <main className="pt-20">
              {children}
            </main>
            <FooterWrapper />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
