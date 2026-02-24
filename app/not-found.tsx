import Link from "next/link";
import CenterTitle from "./components/CenterTitle";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <Image
        src="/logos/logo-nthoe'straight.png"
        alt="Nthoe'Straight Logo"
        width={100}
        height={100}
        className="w-auto h-34 mb-8"
      />
      <CenterTitle
        title="Return Home"
        subtitle="The page you are looking for does not exist."
      />
      <Link
        href="/"
        className="inline-block bg-primary text-white px-8 py-3.5 font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-gray-100 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
