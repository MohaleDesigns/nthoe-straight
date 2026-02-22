import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthProvider";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <CartProvider>
        <main className="min-h-screen">
          {children}
        </main>
      </CartProvider>
    </AuthProvider>
  );
}
