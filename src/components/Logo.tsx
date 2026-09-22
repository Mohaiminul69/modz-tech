import Image from "next/image";
import Link from "next/link";
import logo from "@public/brand/modz-tech-logo.png";

const Logo = ({ className = "" }: { className?: string }) => (
  <Link href="/" className={`flex items-center gap-2 ${className}`}>
    <Image src={logo} alt="Modz Tech" className="h-9 w-auto sm:h-10" priority />
  </Link>
);

export default Logo;
