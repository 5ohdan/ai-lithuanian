import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import logo from "public/logo.svg";

export function Logo() {
  return (
    <Link href="/new-pack">
      <Image src={logo as StaticImageData} alt="Logo" width={200} unoptimized />
    </Link>
  );
}
