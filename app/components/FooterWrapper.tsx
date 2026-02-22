"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  const hideFooter = pathname === "/login";

  if (hideFooter) {
    return null;
  }

  return <Footer />;
}
